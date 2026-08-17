# Publishing a Founder Insight

No code required. Everything below happens in a browser.

## Publishing a new essay

1. Go to **[app.pagescms.org](https://app.pagescms.org)** and sign in with GitHub.
2. Open **SamiPinto / preeti-kennedy-website** → **Founder Insights**.
3. Click **Add new**, fill in the fields, upload a portrait image, write the essay.
4. Click **Save**.

The site rebuilds itself and the essay is live in about 30 seconds. Nothing else
needs doing — the homepage card, the essay count in the headline, the sitemap and
the "continue reading" links all update on their own.

## The fields

| Field | Notes |
|---|---|
| **Web address** | The permanent link, e.g. `why-consistency-wins`. **Set once, never change it** — see below. |
| **Title** | The headline. Safe to edit any time; it never moves the web address. |
| **Search & social description** | What Google shows under the title. 120–160 characters. |
| **Category** | Pick one of the five. |
| **Read time** | In minutes. |
| **Order on homepage** | Lower numbers come first. The highest number is the last essay in the series. |
| **Published** | The on/off switch. See below. |
| **Homepage card image** | Portrait, roughly 760 × 1140. |
| **Essay** | Write in paragraphs. The first one gets the gold drop-cap automatically. |

## Editing an essay after it is published

Open it, change anything, save. It is live ~30 seconds later.

Editing the **Title** is always safe. Editing the **Web address** is not — see below.

## Removing an essay

**Switch _Published_ off. Do not delete.**

Turning it off removes the essay completely — the page, the homepage card, the
sitemap entry — and the "continue reading" links close over the gap. Turning it back
on restores everything exactly as it was.

Deleting is different: it destroys the web address permanently. Anyone arriving from
Google, an old newsletter, or a shared link gets a "page not found". The essay text
itself is still recoverable from the site's history, but the link is gone for good.

## The one thing that can quietly break: the web address

Every published essay has a fixed address, like:

```
preetikennedy.com/insights/why-consistency-wins
```

Google indexes that address. People share it. If it changes, **every one of those
links breaks silently** — the site looks perfectly fine, the traffic just stops.

So: **set the Web address once, when you first create the essay, and never touch it
again.** Changing the Title is always safe and never affects it.

If an address genuinely has to change, put the *old* one in the **Previous web
addresses** field. Anyone following an old link is then forwarded to the new page
instead of hitting a dead end.

## If something goes wrong

Every version of every essay is kept permanently. Anything deleted or edited by
mistake can be restored exactly as it was — ask a developer to recover it from the
site's history.

---

## For developers

```bash
npm install
npm run serve      # local preview with live reload on :8731
npm run build      # production build into _site/
```

- Content lives in `src/insights/*.md`; templates in `src/_includes/`.
- Build config and all generation logic: `eleventy.config.js`.
- CMS field definitions: `.pages.yml`.
- Vercel builds with `npm run build` and serves `_site/` — set in `vercel.json`.
- `npm run build` deletes `_site/` first. This matters: Eleventy does not remove
  stale output, so an unpublished essay's page would otherwise survive as an
  orphaned file and stay reachable.
- URLs come from the `slug` frontmatter field, never from the filename, so a title
  or file rename can never move a published URL.
