/**
 * Site-wide constants. One home for anything repeated across templates.
 *
 * ANALYTICS — the two fields below are the only ones you need to touch.
 *
 *   ga4Id            Google Analytics 4 measurement ID, looks like "G-XXXXXXXXXX".
 *                    Analytics → Admin → Data streams → your stream.
 *   gscVerification  Google Search Console verification token. In Search Console
 *                    choose the "HTML tag" method and paste ONLY the content value
 *                    (the long string), not the whole <meta> tag.
 *
 * Both ship empty. While a field is empty the corresponding tag is not rendered at
 * all — no broken script, no phantom property collecting nothing. Fill one in, and
 * it appears on every page of the site on the next build.
 *
 * `url` is the canonical origin. It is deliberately the apex (no www): every
 * canonical tag, og:url and sitemap entry is built from it, and the Vercel domain
 * settings must redirect www -> apex to match. Changing this without changing
 * Vercel puts the two back out of sync, which is the state that caused the
 * conflicting-signal problem in the first place.
 */
export default {
  url: "https://preetikennedy.com",
  name: "Preeti Kennedy",

  ga4Id: "",
  gscVerification: "",
};
