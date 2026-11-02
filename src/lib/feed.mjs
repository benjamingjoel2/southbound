// Loads the Tourground directory feed and applies the booster's publishing
// rules. Every page that shows a company goes through this module, so the
// rules are enforced in one place:
//
//   1. Only companies with verified: true OR founder_owned: true are published.
//   2. Removed companies (absent from the feed, or removed: true) get no page.
//   3. Example records (is_example: true) are excluded unless INCLUDE_EXAMPLES=1.
//   4. Order comes only from rank[site.rankKey]. Never re-sorted by anything else.
//
// Company facts are never edited here; they come from the feed file as-is.

import fs from 'node:fs';
import path from 'node:path';
import { site } from '../../site.config.mjs';

const ROOT = process.cwd();
const REQUIRED = ['id', 'name', 'kind', 'country_base', 'delivers_in', 'niches', 'tier', 'summary', 'profile_url', 'sources', 'last_checked'];
const TIERS = new Set(['verified', 'black', 'platinum', 'founder']);
const KINDS = new Set(['dmc', 'agency']);

export function feedPath() {
  if (process.env.FEED_PATH) return path.resolve(ROOT, process.env.FEED_PATH);
  const real = path.join(ROOT, 'data', 'feed.json');
  if (fs.existsSync(real)) return real;
  return path.join(ROOT, 'data', 'feed.mock.json');
}

let cache;
export function loadFeed() {
  if (cache) return cache;
  const file = feedPath();
  const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  cache = { file: path.relative(ROOT, file), isMock: file.endsWith('feed.mock.json'), raw };
  return cache;
}

export function includeExamples() {
  return process.env.INCLUDE_EXAMPLES === '1' || process.env.INCLUDE_EXAMPLES === 'true';
}

/** Why a record is not published, or null if it is publishable. */
export function exclusionReason(c) {
  for (const k of REQUIRED) {
    if (c[k] === undefined || c[k] === null || c[k] === '') return `missing field "${k}"`;
  }
  if (!(c.verified === true || c.founder_owned === true)) return 'not verified and not founder-owned';
  if (c.removed === true) return 'marked removed in feed';
  if (c.is_example === true && !includeExamples()) return 'example record (set INCLUDE_EXAMPLES=1 to show)';
  if (!TIERS.has(c.tier)) return `unknown tier "${c.tier}"`;
  if (!KINDS.has(c.kind)) return `unknown kind "${c.kind}"`;
  if (!Array.isArray(c.sources) || c.sources.length === 0) return 'no sources';
  if (!c.delivers_in.some((code) => site.deliveryCodes.includes(code))) return 'does not deliver in this destination';
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(c.id)) return `id "${c.id}" is not URL-safe`;
  return null;
}

export function allCompanies() {
  return loadFeed().raw.companies ?? [];
}

/** Companies that may be published on this booster. Feed order preserved. */
export function publishedCompanies() {
  return allCompanies().filter((c) => exclusionReason(c) === null);
}

export function getCompany(id) {
  return publishedCompanies().find((c) => c.id === id);
}

export function rankOf(c) {
  const r = c.rank?.[site.rankKey];
  return Number.isInteger(r) && r > 0 ? r : null;
}

/**
 * Ranked list for a niche: companies carrying that niche (or all, when the
 * niche has no filter) that have a feed rank, ordered by that rank only.
 * Companies without a rank are returned separately, in feed order.
 */
export function rankedList(niche) {
  const pool = publishedCompanies().filter((c) => !niche.filter || c.niches.includes(niche.filter));
  const ranked = pool
    .filter((c) => rankOf(c) !== null)
    .map((c, i) => ({ c, i }))
    .sort((a, b) => rankOf(a.c) - rankOf(b.c) || a.i - b.i)
    .map(({ c }) => c);
  const unranked = pool.filter((c) => rankOf(c) === null);
  return { ranked, unranked };
}

/** Link rule: Platinum may link to own site (sponsored); everyone else to the Tourground profile. */
export function companyLink(c) {
  if (c.tier === 'platinum' && c.website) {
    return { href: c.website, rel: 'sponsored nofollow', sponsored: true, label: 'Company website' };
  }
  return { href: c.profile_url, rel: undefined, sponsored: false, label: 'Tourground profile' };
}

export function destination() {
  return (loadFeed().raw.destinations ?? []).find((d) => d.slug === site.destinationSlug);
}

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
export function countryName(code) {
  try {
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
}
