/**
 * Defaults for every essay, plus the unpublish mechanism and the slug lock.
 *
 * A collection filter alone is NOT enough to unpublish: it hides the essay from
 * listings while Eleventy still writes the page to disk, leaving the URL quietly
 * live. `permalink: false` is what actually stops the file being written, so the
 * page, the card, the sitemap entry and the next-essay link all disappear together.
 *
 * The URL comes from the explicit `slug` field, never from the filename. That is the
 * slug lock: renaming an essay's title (which some CMSs use to rename the file) can
 * therefore never move a published URL out from under Google or a shared link.
 */
export default {
  layout: "essay.njk",
  published: true,
  readTime: 4,
  category: "Founder & Entrepreneurship",
  order: 999,
  aliases: [],

  eleventyComputed: {
    slug: (data) => data.slug || data.page.fileSlug,
    permalink: (data) =>
      data.published === false
        ? false
        : `/insights/${data.slug || data.page.fileSlug}.html`,
    eleventyExcludeFromCollections: (data) => data.published === false,
  },
};
