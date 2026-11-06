# Data fields

Company facts come **only** from the Tourground directory export. This file lists every field the site reads, and marks the ones that were **assumed** (not in the brief's shape) so the directory team can confirm or rename them.

The site reads `data/feed.json` if it exists, otherwise `data/feed.mock.json`. `FEED_PATH=...` overrides both.

## Top level

| Field | Type | Status | Used for |
|---|---|---|---|
| `destinations[]` | array | from brief | Which destinations exist and where their content lives |
| `companies[]` | array | from brief | Company records |
| `generated_at` | ISO datetime | **assumed** | "Last reviewed" date on feed-driven pages (rankings, operator index, comparison). Falls back to `site.firstPublished` in `site.config.mjs` |

## `destinations[]`

| Field | Type | Status | Notes |
|---|---|---|---|
| `slug` | string | from brief | Must match `site.destinationSlug` (`antarctica`) |
| `name` | string | from brief | |
| `type` | string | from brief | Value used in mock: `region` (Antarctica is not a country) |
| `content_dir` | string | from brief | `content/antarctica`; holds `guide/`, `questions/` and `data/` |

## `companies[]`

| Field | Type | Status | Notes |
|---|---|---|---|
| `id` | string | from brief | URL slug: `/operators/<id>`. Must be lowercase letters, digits, hyphens |
| `name` | string | from brief | |
| `kind` | `dmc` \| `agency` | from brief | `agency` emits JSON-LD `TravelAgency`, `dmc` emits `Organization` |
| `country_base` | ISO 3166-1 alpha-2 | from brief | Name shown via `Intl.DisplayNames` |
| `delivers_in[]` | ISO codes | from brief | A company is only published here if this includes one of `AQ`, `GS`, `FK` (`site.deliveryCodes`) |
| `sells_from[]` | ISO codes | from brief | May be empty; page says "Not stated in the feed" |
| `niches[]` | slugs | from brief, **values assumed** | Slugs this site understands: `expedition`, `small-ships`, `fly-cruise`, `photography`, `wildlife`, `kayaking-camping`, `south-georgia-falklands` (see `src/lib/niches.mjs`) |
| `tier` | `verified` \| `black` \| `platinum` \| `founder` | from brief | Only `platinum` may link to its own website (`rel="sponsored nofollow"`) |
| `verified` | boolean | from brief | Publish rule: `verified === true` **or** `founder_owned === true` |
| `founder_owned` | boolean | from brief | Shows the label "Founder-owned (Tourground Geotrax)" |
| `rank` | object `{COUNTRY: n}` | from brief | The site reads `rank.AQ` (`site.rankKey`). Lower is better. Never re-sorted |
| `summary` | string | from brief | "What it does" on the company page |
| `website` | URL | from brief | Linked only for `platinum` |
| `profile_url` | URL | from brief | Tourground profile; the link for every non-Platinum company |
| `sources[]` | `{url, label}` | from brief | Shown on the company page. A company with no sources is not published |
| `last_checked` | YYYY-MM-DD | from brief | "Last checked" and "Last reviewed" on the company page |
| `memberships[]` | strings or `{name, url}` | **assumed** | "Memberships" on the company page (e.g. IAATO). The brief lists memberships as page content but not as a feed field |
| `is_example` | boolean | **assumed** | Marks fake records in the mock. Excluded from builds unless `INCLUDE_EXAMPLES=1` |
| `removed` | boolean | **assumed**, optional | If the export marks removals instead of dropping the record, `true` unpublishes the page. A record missing from the feed is also unpublished |
| `first_listed` | YYYY-MM-DD | **assumed**, optional | "Published" date on the company page. Falls back to `site.firstPublished` |

## Content front matter (guide and questions)

`content/antarctica/guide/*.md` and `content/antarctica/questions/*.md`:

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Page H1. For questions, the question itself |
| `description` | yes | Meta description and lede |
| `answer` | questions only | The short answer, shown first and used in `FAQPage` JSON-LD |
| `sources[]` | yes to publish | `{url, label}`. A `reviewed` file with no sources fails the build |
| `published` | yes | YYYY-MM-DD |
| `reviewed` | yes | YYYY-MM-DD, the "last reviewed" date |
| `status` | yes | `draft` or `reviewed`. Only `reviewed` is published |
| `order` | no | Sort order in indexes |
| `places[]` | guide only | Keys into `content/antarctica/data/places.json`; listed with coordinates |
| `related[]` | questions only | Slugs of related questions |
| `image` | no | Key of a photo in `content/antarctica/data/images.json` |

## Destination data files (not company facts)

`content/antarctica/data/` holds sourced reference data, each with its own `published`, `reviewed` and `sources`:

- `season.json`: the season chart (rows, month cells, source ids)
- `routes.json`: the port and route comparison table
- `glance.json`: "Antarctica at a glance" on the home page
- `places.json`: coordinates for every place named on the site
- `images.json`: every photo, with credit, licence and source
