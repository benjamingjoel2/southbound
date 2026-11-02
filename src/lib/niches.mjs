// Ranked-list definitions. `filter` is the niche slug a company must carry in
// its feed `niches[]` array (null = every published company that delivers here).
// Order inside each list always comes from the feed rank; see feed.mjs.

export const niches = [
  {
    slug: 'best-expedition-operators',
    filter: null,
    title: 'Best expedition operators for Antarctica',
    short: 'All verified operators',
    intro:
      'Every verified or founder-owned company in the Tourground directory that delivers trips to Antarctica, in the order of the directory rank.',
  },
  {
    slug: 'small-ships',
    filter: 'small-ships',
    title: 'Best small-ship operators for Antarctica',
    short: 'Small ships',
    intro:
      'Companies the directory tags for small-ship voyages. Ship size matters because of the landing limits explained in the guide to ship sizes.',
    guide: '/guide/ship-size',
  },
  {
    slug: 'fly-cruise',
    filter: 'fly-cruise',
    title: 'Best fly-cruise operators for Antarctica',
    short: 'Fly-cruise',
    intro:
      'Companies the directory tags for fly-cruise trips, which replace the Drake Passage crossing with a flight to King George Island.',
    guide: '/questions/what-does-fly-the-drake-mean',
  },
  {
    slug: 'photography',
    filter: 'photography',
    title: 'Best Antarctic photography expedition operators',
    short: 'Photography',
    intro: 'Companies the directory tags for photography-focused voyages.',
  },
  {
    slug: 'wildlife',
    filter: 'wildlife',
    title: 'Best Antarctic wildlife operators: penguins and whales',
    short: 'Wildlife: penguins and whales',
    intro:
      'Companies the directory tags for wildlife-focused trips. For timing, see the season chart for penguin breeding stages and whale sightings.',
    guide: '/season',
  },
  {
    slug: 'kayaking-camping',
    filter: 'kayaking-camping',
    title: 'Best Antarctic kayaking and camping operators',
    short: 'Kayaking and camping',
    intro: 'Companies the directory tags for sea kayaking or overnight camping ashore as part of a voyage.',
  },
  {
    slug: 'south-georgia-falklands',
    filter: 'south-georgia-falklands',
    title: 'Best operators for South Georgia and Falklands combinations',
    short: 'South Georgia and Falklands',
    intro:
      'Companies the directory tags for longer voyages that combine the Antarctic Peninsula with South Georgia and the Falkland Islands.',
    guide: '/guide/regions',
  },
];

export const nicheBySlug = Object.fromEntries(niches.map((n) => [n.slug, n]));
/** Niche filter slug -> human label, for company pages. */
export const nicheLabel = {
  expedition: 'Antarctic expeditions',
  'small-ships': 'Small ships',
  'fly-cruise': 'Fly-cruise',
  photography: 'Photography',
  wildlife: 'Wildlife (penguins and whales)',
  'kayaking-camping': 'Kayaking and camping',
  'south-georgia-falklands': 'South Georgia and Falklands',
};
