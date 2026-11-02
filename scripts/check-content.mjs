// Pre-build gate. Fails the build when publishing rules are broken; prints
// what will and will not be published.
//
//  - Guide / Q&A markdown: only status: reviewed is published, and a reviewed
//    file with no sources is an error (never publish text without sources).
//  - Feed: reports which companies are excluded and why (unverified,
//    prospects, removed, examples), and rejects duplicate ids.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { loadFeed, allCompanies, exclusionReason, publishedCompanies } from '../src/lib/feed.mjs';

const ROOT = process.cwd();
const errors = [];
const warn = [];
const isoRe = /^\d{4}-\d{2}-\d{2}$/;

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : d.name.endsWith('.md') ? [path.join(dir, d.name)] : []));
}

const feed = loadFeed();
const dests = feed.raw.destinations ?? [];
let published = 0;
let drafts = 0;
for (const dest of dests) {
  for (const kind of ['guide', 'questions']) {
    for (const file of walk(path.join(ROOT, dest.content_dir, kind))) {
      const rel = path.relative(ROOT, file);
      const { data, content } = matter(fs.readFileSync(file, 'utf8'));
      const req = ['title', 'description', 'published', 'reviewed', 'status'];
      if (kind === 'questions') req.push('answer');
      for (const k of req) if (data[k] === undefined || data[k] === '') errors.push(`${rel}: missing front matter "${k}"`);
      if (!['draft', 'reviewed'].includes(data.status)) errors.push(`${rel}: status must be draft or reviewed`);
      const sources = Array.isArray(data.sources) ? data.sources : [];
      for (const s of sources) if (!s?.url || !s?.label) errors.push(`${rel}: every source needs url and label`);
      for (const k of ['published', 'reviewed']) {
        const v = data[k] instanceof Date ? data[k].toISOString().slice(0, 10) : String(data[k] ?? '');
        if (!isoRe.test(v)) errors.push(`${rel}: ${k} must be YYYY-MM-DD`);
      }
      if (data.status === 'reviewed') {
        if (sources.length === 0) errors.push(`${rel}: status is reviewed but there are no sources. Never publish text without sources.`);
        if (!content.trim()) errors.push(`${rel}: empty body`);
        published++;
      } else {
        drafts++;
        console.log(`  draft (not published): ${rel}`);
      }
    }
  }
}

const ids = new Set();
for (const c of allCompanies()) {
  if (ids.has(c.id)) errors.push(`feed: duplicate company id "${c.id}"`);
  ids.add(c.id);
  const why = exclusionReason(c);
  if (why) console.log(`  company excluded: ${c.id ?? '(no id)'}: ${why}`);
}
if (feed.isMock) warn.push(`using ${feed.file} (mock feed). Put the directory export at data/feed.json or set FEED_PATH.`);

console.log(`content: ${published} reviewed page(s) will be published, ${drafts} draft(s) skipped`);
console.log(`feed: ${feed.file}: ${publishedCompanies().length} of ${allCompanies().length} companies publishable`);
for (const w of warn) console.warn(`warning: ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}
