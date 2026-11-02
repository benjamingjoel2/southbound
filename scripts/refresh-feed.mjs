// Refresh data/feed.json from the Tourground directory export.
//
//   TOURGROUND_FEED_URL=https://... [TOURGROUND_FEED_TOKEN=...] npm run feed:refresh
//   npm run feed:refresh -- ./path/to/export.json      (from a local file)
//
// The export is written as-is (never hand-edited). The script prints which
// companies were added or removed; removed companies lose their pages on the
// next build because pages are generated only from the feed.
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'data', 'feed.json');
const arg = process.argv[2];
let text;
if (arg) {
  text = fs.readFileSync(path.resolve(arg), 'utf8');
} else if (process.env.TOURGROUND_FEED_URL) {
  const res = await fetch(process.env.TOURGROUND_FEED_URL, {
    headers: process.env.TOURGROUND_FEED_TOKEN ? { Authorization: `Bearer ${process.env.TOURGROUND_FEED_TOKEN}` } : {},
  });
  if (!res.ok) throw new Error(`feed request failed: ${res.status} ${res.statusText}`);
  text = await res.text();
} else {
  console.error('Set TOURGROUND_FEED_URL or pass a local export file. Until the export exists the build uses data/feed.mock.json.');
  process.exit(1);
}

const next = JSON.parse(text);
if (!Array.isArray(next.destinations) || !Array.isArray(next.companies)) throw new Error('feed must have destinations[] and companies[]');
const prev = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : { companies: [] };
const before = new Set(prev.companies.map((c) => c.id));
const after = new Set(next.companies.map((c) => c.id));
const added = [...after].filter((id) => !before.has(id));
const removed = [...before].filter((id) => !after.has(id));
fs.writeFileSync(OUT, JSON.stringify(next, null, 2) + '\n');
console.log(`wrote ${path.relative(process.cwd(), OUT)}: ${next.companies.length} companies`);
if (added.length) console.log(`added: ${added.join(', ')}`);
if (removed.length) console.log(`removed (pages will be unpublished on next build): ${removed.join(', ')}`);
console.log('Run npm run build to see which companies are publishable.');
