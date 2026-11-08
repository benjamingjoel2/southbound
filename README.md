# Southbound

The reference for choosing an Antarctic expedition: routes, seasons, ships, departure ports and the verified expedition operators who run them.

A Tourground destination booster: a small, independent, static reference site at **https://southbound.tourground.com** that points into the Tourground directory. Built with [Astro](https://astro.build), hosted on Vercel.

## Run it

Requires Node 22.

```bash
npm ci
```

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run preview
```

`npm run build` runs three steps, and any failure stops the build:

1. `scripts/check-content.mjs`: enforces the publishing rules (reviewed + sourced content only; reports which companies are excluded from the feed and why).
2. `astro build`: generates the static site into `dist/`.
3. `scripts/validate-jsonld.mjs`: parses every page and checks JSON-LD (Article, FAQPage, ItemList, BreadcrumbList, TravelAgency/Organization, TouristDestination), one H1 per page, canonical and Open Graph tags, image dimensions, the "Published by Tourground." footer, the correction link on company pages, and that there are no phone, WhatsApp or social links and no email other than the configured one.

To see the two fake example companies locally:

```bash
INCLUDE_EXAMPLES=1 npm run dev
```

## Where things live

| Path | What |
|---|---|
| `site.config.mjs` | **The one config file**: name, domain, editor line, accent colour, email, business address, publisher and correction URLs, and all disclosure, label and legal wording |
| `data/feed.mock.json` | Stand-in for the Tourground directory export |
| `data/feed.json` | The real export, once it exists (takes priority over the mock) |
| `content/antarctica/guide/*.md` | Destination guide pages |
| `content/antarctica/questions/*.md` | Q&A pages |
| `content/antarctica/data/*.json` | Season chart, port/route table, home-page facts, coordinates |
| `src/lib/feed.mjs` | Feed loading and every company publishing rule |
| `src/lib/niches.mjs` | The ranked lists (by specialty) |
| `src/lib/schema.mjs` | JSON-LD builders |
| `DATA-FIELDS.md` | Every feed and front-matter field the site reads, assumed ones marked |
| `FACTS-TO-VERIFY.md` | Every fact that needs checking, with its source and date |

## Add or update reviewed content

Guide and Q&A pages are markdown with front matter:

```markdown
---
title: Is the Drake Passage really that rough?
description: One line for search results and the page lede.
answer: The short answer, shown first. (Questions only.)
sources:
  - url: https://example.org/page
    label: Publisher: page title
published: 2026-11-02
reviewed: 2026-11-02
status: draft
order: 10
---

Body in markdown.
```

Rules (enforced by the build):

- Only `status: reviewed` is published. Leave new text as `draft` until an editor has checked it against its sources.
- A `reviewed` page with no `sources` fails the build. Never publish text without sources.
- When you re-check a page, update `reviewed:`; the page, sitemap and JSON-LD `dateModified` follow.
- Do not add statistics, counts, quotes or reviews without a source. If there is no source, leave it out.
- Add any new place to `content/antarctica/data/places.json` (with coordinates and source) and reference it in `places:`.

Season chart and route table data are in `content/antarctica/data/season.json` and `routes.json`; every row or cell names its source ids, and every source is listed on the page.

## Refresh the feed

Company facts are never edited by hand here. To pull the directory export:

```bash
TOURGROUND_FEED_URL=https://... TOURGROUND_FEED_TOKEN=... npm run feed:refresh
```

or, from a downloaded file:

```bash
npm run feed:refresh -- ./export.json
```

This writes `data/feed.json` unchanged and prints which companies were added or removed. Commit it and push; Vercel rebuilds.

What the build does with the feed:

- Publishes only companies with `verified: true` or `founder_owned: true` that deliver in Antarctica, South Georgia or the Falklands. Unverified companies and prospects are never published.
- A company that disappears from the feed (or is marked `removed: true`, or loses verification) has no page in the next build, and drops out of every list, the sitemap and `llms.txt`.
- Ranked lists use only `rank.AQ` from the feed, lowest first. Nothing is re-sorted.
- Platinum companies link to their own site with `rel="sponsored nofollow"`; everyone else links to their Tourground profile.
- Founder-owned brands carry the label "Founder-owned (Tourground Geotrax)".

## Paid placements

Not built yet. `src/components/AdSlot.astro` is the reserved slot: it sits at the top of each ranked list, outside the list, and when given items it renders them in a dashed box labelled "Advertisement feature" with `rel="sponsored nofollow"` links. Label wording lives in `site.config.mjs`.

## Deploy

Vercel project in the team "Benjamin - Sevo", connected to `benjamingjoel2/southbound`. Every push to `main` deploys to production. `vercel.json` sets the build command, the `dist` output folder and clean URLs (no `.html`, no trailing slash). Analytics: Vercel Web Analytics only (cookieless); enable it in the Vercel project's Analytics tab.

## Before launch

- Legal sign-off (US, UK, EU, Brazil) on the wording in `site.config.mjs`; then set `legal.signoff.status` to `signed-off`.
- Confirm the business address and set `address.placeholder` to `false`.
- Replace the placeholder corrections URL (`publisher.correctionsUrl`).
- Replace the mock feed with the directory export.
- Work through `FACTS-TO-VERIFY.md`.

## Credits

Fonts: Newsreader, IBM Plex Sans and IBM Plex Mono, SIL Open Font License 1.1, self-hosted from Fontsource. Coordinates: © OpenStreetMap contributors (ODbL). Photos: Creative Commons licensed (CC BY 2.0 / CC BY-SA 4.0), credited on the Photo credits page (`/photo-credits`, linked from the footer) and listed with source and licence in `content/antarctica/data/images.json`; resized versions of CC BY-SA photos are shared under the same licence. Add photos by dropping a JPEG in `src/assets/photos/`, adding an entry to `images.json`, and setting `image:` in a page's front matter. Unsplash photos are allowed (licence "Unsplash License"; no credit line needed on the page). No photos of identifiable people. The Open Graph image is generated from the site's own type and colours.
