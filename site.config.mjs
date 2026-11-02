// ---------------------------------------------------------------------------
// Southbound: the one configuration file.
//
// Name, domain, editor line, accent colour, contact details, business address
// and EVERY piece of disclosure / paid-label / legal wording lives here, so an
// editor or lawyer can change it without touching templates.
//
// LEGAL SIGN-OFF: the wording under `disclosure`, `labels` and `legal` must be
// signed off for the US, UK, EU and Brazil before launch. Until then
// `legal.signoff.status` stays "pending" and is shown on the legal pages.
// ---------------------------------------------------------------------------

export const site = {
  name: 'Southbound',
  tagline: 'Every Antarctic trip starts by heading south.',
  positioning:
    'The reference for choosing an Antarctic expedition: routes, seasons, ships, departure ports and the verified expedition operators who run them.',
  domain: 'southbound.tourground.com',
  url: 'https://southbound.tourground.com',
  language: 'en',
  // Date the site (and its feed-driven pages) was first published.
  firstPublished: '2026-11-02',
  locale: 'en_GB',

  // Shown under the masthead and on About.
  editorLine: 'Edited by the Tourground publishing desk for Antarctica.',

  // The single accent colour (signal orange). Used sparingly: links on hover,
  // the current-position marker, the advertisement label.
  accent: '#E8590C',

  // Owner rule 3: the only email address on the site.
  email: 'southbound@tourground.com',

  // Owner rule 4: business address. PLACEHOLDER until the founders confirm.
  // Listed in FACTS-TO-VERIFY.md. While `placeholder` is true the site prints
  // "(placeholder address, to be confirmed)" next to it.
  address: {
    placeholder: true,
    organisation: 'Tourground publishing desk (Antarctica)',
    building: 'WeWork Torre Catalinas Plaza',
    street: 'Avenida Eduardo Madero 900',
    locality: 'Buenos Aires',
    postalCode: 'C1106ACV',
    country: 'Argentina',
    countryCode: 'AR',
  },

  // Destination this booster covers (must match a slug in the feed).
  destinationSlug: 'antarctica',
  // ISO 3166 code used as the key into each company's `rank` object.
  rankKey: 'AQ',
  // Other territory codes that count as "delivers in this destination".
  deliveryCodes: ['AQ', 'GS', 'FK'],

  // Coordinates of the destination for the masthead and JSON-LD.
  geo: { lat: -64.82, lon: -63.49, label: 'Antarctic Peninsula' },
};

export const publisher = {
  name: 'Tourground',
  url: 'https://tourground.com',
  // Footer line, verbatim. Linked to publisher.url.
  footerLine: 'Published by Tourground.',
  // Main-site contact flow for corrections and removals.
  // PLACEHOLDER URL until the main site's contact flow exists.
  correctionsUrl: 'https://tourground.com/contact?topic=correction&site=southbound',
  correctionsUrlIsPlaceholder: true,
};

// Founder-owned brands: label text is fixed by the booster brief.
export const labels = {
  founderOwned: 'Founder-owned (Tourground Geotrax)',
  advertisement: 'Advertisement feature',
  requestCorrection: 'Request a correction or removal',
  tiers: {
    verified: 'Verified',
    black: 'Verified (Black tier)',
    platinum: 'Verified (Platinum tier)',
    founder: 'Founder-owned',
  },
  kinds: {
    dmc: 'Destination management company',
    agency: 'Travel agency',
  },
  example: 'Example record (not a real company)',
};

// Disclosure wording. Plain language; lawyers edit here.
export const disclosure = {
  // Short line printed on every ranked list and company page.
  short:
    'Southbound is published by Tourground. Rankings come only from the Tourground directory feed and are never paid for.',
  founderNote:
    'Seventh Continent is owned by the founders of Tourground. It is labelled "Founder-owned (Tourground Geotrax)" wherever it appears and is ranked by the same rules as every other company.',
  rankingNote:
    'Order is taken from the rank field of the Tourground directory feed. We do not reorder it and payment has no effect on it.',
  adSlotNote:
    'Advertisement features are paid placements. They are always shown here, above the editorial list, and never affect the ranking below.',
  sponsoredLinkNote:
    'Links marked "sponsored" lead to a company\'s own website because that company holds a paid Platinum listing.',
  verifiedOnly:
    'We list only companies the Tourground directory marks as verified or founder-owned. Unverified companies and prospects are never published.',
  noInventedFacts:
    'We do not publish statistics, reviews, quotes or counts without a source. Where we have no source, we leave it out.',
};

export const legal = {
  // Change to "signed-off" with the date once counsel for each market approves.
  signoff: {
    status: 'pending',
    markets: ['United States', 'United Kingdom', 'European Union', 'Brazil'],
    note: 'Legal wording on this site is awaiting sign-off for the United States, United Kingdom, European Union and Brazil.',
  },
  controller: 'Tourground',
  effectiveDate: '2026-11-02',
  governingLawNote:
    'These terms are governed by the laws of the place where the publisher is established, without prejudice to mandatory consumer protections in the country where you live.',
  analytics: {
    provider: 'Vercel Web Analytics',
    providerUrl: 'https://vercel.com/docs/analytics/privacy-policy',
  },
  hosting: {
    provider: 'Vercel Inc.',
    providerUrl: 'https://vercel.com/legal/privacy-policy',
  },
};

export const nav = [
  { href: '/guide', label: 'Guide' },
  { href: '/season', label: 'Season chart' },
  { href: '/compare', label: 'Ports & routes' },
  { href: '/rankings', label: 'Operators' },
  { href: '/questions', label: 'Questions' },
];

export const footerNav = [
  { href: '/about', label: 'About' },
  { href: '/how-we-rank', label: 'How we rank' },
  { href: '/disclosure', label: 'Publisher disclosure' },
  { href: '/corrections', label: 'Corrections and removal' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms' },
  { href: '/cookies', label: 'Cookie Policy' },
];

export default { site, publisher, labels, disclosure, legal, nav, footerNav };
