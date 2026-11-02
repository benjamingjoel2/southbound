// Post-build validator. Parses every HTML page in dist/ and checks:
//  - JSON-LD parses, uses schema.org, and the types we emit carry their
//    required properties (Article, FAQPage, ItemList, BreadcrumbList,
//    TravelAgency/Organization, TouristDestination).
//  - exactly one <h1>, a canonical URL (except 404), Open Graph tags,
//    width/height on every <img>, the "Published by Tourground." footer link.
//  - company pages carry the correction/removal link.
//  - no phone numbers, WhatsApp links or social links; only the one email.
import fs from 'node:fs';
import path from 'node:path';
import { site, publisher, labels } from '../site.config.mjs';

const DIST = path.join(process.cwd(), 'dist');
const errors = [];
const counts = {};

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : d.name.endsWith('.html') ? [path.join(dir, d.name)] : []));
}
const req = (node, keys, where) => {
  for (const k of keys) {
    const v = node[k];
    if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) errors.push(`${where}: ${[].concat(node['@type']).join('/')} missing "${k}"`);
  }
};
const isUrl = (u) => typeof u === 'string' && /^https:\/\//.test(u);

function checkNode(n, where) {
  const types = [].concat(n['@type'] ?? []);
  for (const t of types) counts[t] = (counts[t] ?? 0) + 1;
  if (types.includes('Article')) {
    req(n, ['headline', 'datePublished', 'dateModified', 'author', 'publisher', 'image', 'mainEntityOfPage'], where);
    if (n.headline?.length > 110) errors.push(`${where}: Article headline over 110 chars`);
    for (const k of ['datePublished', 'dateModified']) if (n[k] && isNaN(Date.parse(n[k]))) errors.push(`${where}: Article ${k} not a date`);
    if (Date.parse(n.dateModified) < Date.parse(n.datePublished)) errors.push(`${where}: dateModified before datePublished`);
  }
  if (types.includes('FAQPage')) {
    req(n, ['mainEntity'], where);
    for (const q of n.mainEntity ?? []) {
      if (q['@type'] !== 'Question' || !q.name || q.acceptedAnswer?.['@type'] !== 'Answer' || !q.acceptedAnswer?.text) errors.push(`${where}: malformed FAQ Question`);
    }
  }
  if (types.includes('ItemList')) {
    req(n, ['itemListElement', 'name'], where);
    (n.itemListElement ?? []).forEach((li, i) => {
      if (li['@type'] !== 'ListItem' || li.position !== i + 1 || !isUrl(li.url)) errors.push(`${where}: ItemList item ${i + 1} malformed`);
    });
  }
  if (types.includes('BreadcrumbList')) {
    req(n, ['itemListElement'], where);
    (n.itemListElement ?? []).forEach((li, i) => {
      if (li['@type'] !== 'ListItem' || li.position !== i + 1 || !li.name || !isUrl(li.item)) errors.push(`${where}: breadcrumb ${i + 1} malformed`);
    });
  }
  if (types.includes('TravelAgency') || (types.includes('Organization') && n['@id']?.endsWith('#company'))) {
    req(n, ['name', 'url', 'description', 'address'], where);
  }
  if (types.includes('TouristDestination')) req(n, ['name', 'geo'], where);
}

const files = walk(DIST);
for (const f of files) {
  const rel = '/' + path.relative(DIST, f);
  const html = fs.readFileSync(f, 'utf8');
  const is404 = rel === '/404.html';
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (blocks.length === 0) errors.push(`${rel}: no JSON-LD`);
  for (const b of blocks) {
    let data;
    try { data = JSON.parse(b[1]); } catch (e) { errors.push(`${rel}: JSON-LD does not parse: ${e.message}`); continue; }
    if (data['@context'] !== 'https://schema.org') errors.push(`${rel}: @context must be https://schema.org`);
    for (const n of data['@graph'] ?? [data]) checkNode(n, rel);
  }
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) errors.push(`${rel}: ${h1} <h1> elements (need exactly 1)`);
  if (!is404 && !/<link rel="canonical" href="https:\/\/[^"]+"/.test(html)) errors.push(`${rel}: no canonical`);
  for (const p of ['og:title', 'og:description', 'og:url', 'og:image', 'og:type']) if (!html.includes(`property="${p}"`)) errors.push(`${rel}: missing ${p}`);
  for (const img of html.match(/<img\b[^>]*>/g) ?? []) if (!/\bwidth=/.test(img) || !/\bheight=/.test(img)) errors.push(`${rel}: <img> without width/height`);
  if (!html.includes(publisher.footerLine) || !html.includes(`href="${publisher.url}"`)) errors.push(`${rel}: footer "${publisher.footerLine}" link missing`);
  if (rel.startsWith('/operators/') && rel !== '/operators.html' && !html.includes(labels.requestCorrection)) errors.push(`${rel}: no "${labels.requestCorrection}" link`);
  if (/href="tel:|wa\.me|whatsapp/i.test(html)) errors.push(`${rel}: phone or WhatsApp link`);
  if (/\/\/(www\.)?(facebook|instagram|twitter|x|linkedin|tiktok|youtube)\.com/i.test(html)) errors.push(`${rel}: social media link`);
  for (const m of html.matchAll(/mailto:([^"?]+)/g)) if (m[1] !== site.email) errors.push(`${rel}: unexpected email ${m[1]}`);
  if (/<script(?![^>]*type="(application\/ld\+json|module)")(?![^>]*\b(defer|async)\b)[^>]*\bsrc=/i.test(html)) errors.push(`${rel}: render-blocking script`);
}

console.log(`validated ${files.length} HTML files; JSON-LD types: ${Object.entries(counts).map(([k, v]) => `${k}×${v}`).join(', ')}`);
if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}
console.log('JSON-LD and page checks passed');
