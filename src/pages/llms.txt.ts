import type { APIRoute } from 'astro';
import { site, publisher, disclosure, labels } from '../../site.config.mjs';
import { guidePages, questionPages } from '../lib/content';
import { niches } from '../lib/niches.mjs';
import { publishedCompanies, rankedList } from '../lib/feed.mjs';
import { feedDate } from '../lib/feedmeta.mjs';

export const GET: APIRoute = async () => {
  const u = (p: string) => `${site.url}${p}`;
  const guide = await guidePages();
  const qs = await questionPages();
  const companies = publishedCompanies();
  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.positioning} Published by ${publisher.name} (${publisher.url}). ${disclosure.verifiedOnly} ${disclosure.rankingNote}`,
    '',
    `Every factual page shows a published date, a last-reviewed date and its sources. Company data: Tourground directory feed, export of ${feedDate()}.`,
    '',
    '## Reference tables',
    `- [Antarctic season chart, November to March](${u('/season')}): sea ice, daylight, penguin breeding stages, whale sightings and temperatures by month, with sources.`,
    `- [Departure ports and routes compared](${u('/compare')}): Ushuaia, Punta Arenas and fly-cruise via King George Island: crossing time, days on the ice, typical trip length.`,
    '',
    '## Destination guide',
    ...guide.map((e) => `- [${e.data.title}](${u('/guide/' + e.id)}): ${e.data.description}`),
    '',
    '## Questions',
    ...qs.map((e) => `- [${e.data.title}](${u('/questions/' + e.id)}): ${e.data.answer}`),
    '',
    '## Ranked lists of verified operators',
    ...niches.map((n) => `- [${n.title}](${u('/rankings/' + n.slug)}): ${rankedList(n).ranked.length} ranked`),
    '',
    '## Company records',
    ...companies.map((c) => `- [${c.name}](${u('/operators/' + c.id)})${c.founder_owned ? ` (${labels.founderOwned})` : ''}`),
    '',
    '## About this source',
    `- [About](${u('/about')})`,
    `- [How we rank](${u('/how-we-rank')})`,
    `- [Publisher disclosure](${u('/disclosure')})`,
    `- [Corrections and removal](${u('/corrections')})`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
