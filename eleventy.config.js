import { readdirSync, existsSync } from "node:fs";

/**
 * Preeti Kennedy — build config.
 *
 * Input is src/ (templates + essay markdown only). The heavy asset folders stay
 * where they have always been at the repo root and are passthrough-copied, so the
 * migration did not have to move a single image.
 *
 * Everything derived from an essay is generated here, never maintained by hand:
 * the homepage cards, the essay count, the next-essay chain, and sitemap.xml.
 * That is the whole point of the exercise — those four were the steps that rotted
 * silently when someone forgot them.
 */
export default function (eleventyConfig) {
  // Assets keep their existing repo-root locations.
  for (const dir of ["images", "uploads", "press-assets", "book"]) {
    if (existsSync(dir)) eleventyConfig.addPassthroughCopy({ [dir]: dir });
  }
  for (const file of [
    "favicon.svg",
    "apple-touch-icon.png",
    "icon-192.png",
    "icon-512.png",
    "site.webmanifest",
    "robots.txt",
  ]) {
    if (existsSync(file)) eleventyConfig.addPassthroughCopy({ [file]: file });
  }

  /**
   * Published essays, in display order.
   *
   * `published: false` is the unpublish toggle — the file stays in the repo and in
   * git history, but the essay leaves the site entirely: no page, no homepage card,
   * no sitemap entry, and the next-essay chain closes over the gap. One click to
   * reverse. This is the safe alternative to deleting, which would 404 a URL that
   * Google has indexed.
   */
  eleventyConfig.addCollection("essays", (api) =>
    api
      .getFilteredByGlob("src/insights/*.md")
      .filter((item) => item.data.published !== false)
      .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))
  );

  // Every essay file including unpublished ones — used to detect duplicate slugs.
  eleventyConfig.addCollection("allEssays", (api) =>
    api.getFilteredByGlob("src/insights/*.md")
  );

  /**
   * Flattened old-slug -> current-slug pairs, one entry per alias.
   *
   * Paginating the redirect template over this (rather than over essays, and
   * skipping the ones without aliases) means zero aliases produces zero pages.
   * Skipping inside the template instead would make all 20 essays resolve to the
   * same permalink and collide.
   */
  eleventyConfig.addCollection("aliasRedirects", (api) => {
    const out = [];
    for (const essay of api
      .getFilteredByGlob("src/insights/*.md")
      .filter((item) => item.data.published !== false)) {
      for (const alias of essay.data.aliases ?? []) {
        if (alias && alias !== (essay.data.slug || essay.fileSlug)) {
          out.push({ alias, slug: essay.data.slug || essay.fileSlug, title: essay.data.title });
        }
      }
    }
    return out;
  });

  /**
   * The first paragraph carries class="lead", which drives the gold drop-cap via
   * `p.lead::first-letter`. Authors just write paragraphs; the class is applied here
   * so nobody has to remember markup.
   */
  eleventyConfig.addFilter("leadFirst", (html) => {
    if (typeof html !== "string") return html;
    return html.replace(/<p>/, '<p class="lead">');
  });

  /**
   * Next essay in display order. Deliberately does NOT wrap: the final essay shows
   * bespoke closing copy ("That's the last one — for now") linking back to the
   * index, which is how the site was originally written. Wrapping round to essay
   * one would have quietly thrown that away.
   */
  eleventyConfig.addFilter("nextEssay", (essays, slug) => {
    if (!Array.isArray(essays)) return null;
    const i = essays.findIndex((e) => (e.data.slug || e.fileSlug) === slug);
    if (i === -1 || i === essays.length - 1) return null;
    return essays[i + 1];
  });

  eleventyConfig.addFilter("htmlEscape", (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
  );

  /** JSON-LD and meta tags need a plain-text, quote-safe string. */
  eleventyConfig.addFilter("jsonString", (s) => JSON.stringify(String(s ?? "")));

  /**
   * Category archive slug. Categories are free text in the CMS ("Personal / Founder
   * Brand"), so the slash has to collapse rather than become a path separator —
   * otherwise the archive would nest a directory deep and the URL would not match
   * what the sitemap and breadcrumb claim.
   */
  eleventyConfig.addFilter("categorySlug", (s) =>
    String(s ?? "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );

  /**
   * Human-readable date for the byline. Built from UTC parts for the same reason
   * isoDate is: the frontmatter dates are local-midnight Dates, and toLocaleDateString
   * would render the previous day west of Greenwich.
   */
  eleventyConfig.addFilter("readableDate", (d) => {
    if (!d) return "";
    const dt = typeof d === "string" ? new Date(`${d.slice(0, 10)}T00:00:00Z`) : d;
    if (Number.isNaN(dt.getTime())) return "";
    const months = ["January","February","March","April","May","June",
                    "July","August","September","October","November","December"];
    return `${dt.getUTCDate()} ${months[dt.getUTCMonth()]} ${dt.getUTCFullYear()}`;
  });

  /**
   * One entry per category that has at least one published essay, so an archive is
   * never generated for a category the CMS no longer uses.
   */
  eleventyConfig.addCollection("categories", (api) => {
    const slugify = (s) =>
      String(s ?? "").toLowerCase().replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const byName = new Map();
    for (const essay of api
      .getFilteredByGlob("src/insights/*.md")
      .filter((item) => item.data.published !== false)
      .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))) {
      const name = essay.data.category;
      if (!name) continue;
      if (!byName.has(name)) byName.set(name, { name, slug: slugify(name), essays: [] });
      byName.get(name).essays.push(essay);
    }
    return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
  });

  eleventyConfig.addFilter("isoDate", (d) => {
    if (!d) return "";
    if (typeof d === "string") return d.slice(0, 10);
    // Use UTC parts: toISOString() on a local-midnight Date can land on the
    // previous day for negative-offset zones.
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(
      d.getUTCDate()
    ).padStart(2, "0")}`;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
}
