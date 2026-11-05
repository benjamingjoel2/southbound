// Generates the chart plates in public/charts/*.svg.
//
// Charts are drawn by Southbound from:
//   - coastlines: Natural Earth 1:10m land polygons (public domain),
//     https://www.naturalearthdata.com/  (download ne_10m_land.geojson)
//   - positions: content/antarctica/data/places.json (OpenStreetMap, ODbL)
//
// Usage:
//   node scripts/make-charts.mjs path/to/ne_10m_land.geojson
//
// Output is committed; the site build does not need the Natural Earth file.
// Projection is Mercator, as on nautical charts. Routes are straight lines on
// the chart and are labelled with the great-circle distances from routes.json.

import fs from 'node:fs';
import path from 'node:path';

const landFile = process.argv[2];
if (!landFile) {
  console.error('usage: node scripts/make-charts.mjs ne_10m_land.geojson');
  process.exit(1);
}
const land = JSON.parse(fs.readFileSync(landFile, 'utf8'));
const places = JSON.parse(fs.readFileSync('content/antarctica/data/places.json', 'utf8')).places;
const OUT = 'public/charts';
fs.mkdirSync(OUT, { recursive: true });

const C = { ice: '#f7fafc', sea: '#e3eef5', land: '#f7fafc', coast: '#0b2239', grid: '#a9c7d9', ink: '#0b2239', muted: '#4a6075', signal: '#e8590c' };
const rad = (d) => (d * Math.PI) / 180;
const mercY = (lat) => Math.log(Math.tan(Math.PI / 4 + rad(lat) / 2));

function chart({ name, title, bbox: [lon0, lon1, latN, latS], width = 1200, grid = 2, points = [], lines = [], parallels = [], notes = [] }) {
  const yN = mercY(latN);
  const yS = mercY(latS);
  const sx = width / rad(lon1 - lon0);
  const height = Math.round((yN - yS) * sx);
  const px = (lon) => (rad(lon - lon0)) * sx;
  const py = (lat) => (yN - mercY(lat)) * sx;
  const m = 40; // clamp margin so clipped rings stay closed
  const clampX = (x) => Math.max(-m, Math.min(width + m, x));
  const clampY = (y) => Math.max(-m, Math.min(height + m, y));

  // Land paths: keep rings whose bbox touches the chart, clamp and decimate.
  let d = '';
  const inBox = (ring) => {
    let a = Infinity, b = -Infinity, c = Infinity, e = -Infinity;
    for (const [lo, la] of ring) { a = Math.min(a, lo); b = Math.max(b, lo); c = Math.min(c, la); e = Math.max(e, la); }
    return !(b < lon0 - 2 || a > lon1 + 2 || e < latS - 2 || c > latN + 2);
  };
  for (const f of land.features) {
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
    for (const poly of polys) {
      for (const ring of poly) {
        if (!inBox(ring)) continue;
        let last = null;
        let seg = '';
        let n = 0;
        for (const [lo, la] of ring) {
          if (la < -85) continue;
          const x = clampX(px(lo));
          const y = clampY(py(Math.max(la, -85)));
          if (last && Math.hypot(x - last[0], y - last[1]) < 1.6) continue;
          seg += (n === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1);
          last = [x, y];
          n++;
        }
        if (n > 3) d += seg + 'Z';
      }
    }
  }

  const fmt = (v, pos, neg) => `${Math.abs(v)}°${v < 0 ? neg : pos}`;
  let g = '';
  for (let lon = Math.ceil(lon0 / grid) * grid; lon <= lon1; lon += grid) {
    const x = px(lon).toFixed(1);
    if (+x < 60) continue;
    g += `<line x1="${x}" y1="0" x2="${x}" y2="${height}"/>`;
    g += `<text x="${(+x + 4).toFixed(1)}" y="${height - 8}" class="gl">${fmt(lon, 'E', 'W')}</text>`;
  }
  for (let lat = Math.ceil(latS / grid) * grid; lat <= latN; lat += grid) {
    const y = py(lat).toFixed(1);
    if (+y > height - 30 || +y < 20) continue;
    g += `<line x1="0" y1="${y}" x2="${width}" y2="${y}"/>`;
    g += `<text x="6" y="${(+y - 5).toFixed(1)}" class="gl">${fmt(lat, 'N', 'S')}</text>`;
  }

  let par = '';
  for (const p of parallels) {
    const y = py(p.lat).toFixed(1);
    par += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" class="par"/><text x="${width - 10}" y="${(+y - 8).toFixed(1)}" class="pl" text-anchor="end">${p.label}</text>`;
  }

  let ln = '';
  for (const l of lines) {
    const a = places[l.from], b = places[l.to];
    const x1 = px(a.lon), y1 = py(a.lat), x2 = px(b.lon), y2 = py(b.lat);
    ln += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" class="${l.kind}"/>`;
    if (l.label) {
      const mx = (x1 + x2) / 2 + (l.dx ?? 10), my = (y1 + y2) / 2 + (l.dy ?? 0);
      ln += `<text x="${mx.toFixed(1)}" y="${my.toFixed(1)}" class="ll ${l.kind}-t">${l.label}</text>`;
    }
  }

  let pt = '';
  for (const p of points) {
    const pl = places[p.key];
    const x = px(pl.lon), y = py(pl.lat);
    const anchor = p.anchor ?? 'start';
    const tx = x + (anchor === 'end' ? -14 : 14), ty = y + (p.dy ?? 8);
    pt += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" class="pt"/>`;
    pt += `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="${anchor}" class="pn">${p.label ?? pl.name}</text>`;
  }

  let nt = '';
  notes.forEach((t, i) => { nt += `<text x="${width - 12}" y="${28 + i * 24}" text-anchor="end" class="gl">${t}</text>`; });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${title}">
<title>${title}</title>
<style>
.gl{font:20px 'IBM Plex Mono',ui-monospace,monospace;fill:${C.muted}}
.pn{font:500 27px 'IBM Plex Sans',system-ui,sans-serif;fill:${C.ink};paint-order:stroke;stroke:${C.sea};stroke-width:5px;stroke-linejoin:round}
.ll{font:23px 'IBM Plex Mono',ui-monospace,monospace;paint-order:stroke;stroke:${C.sea};stroke-width:5px}
.sea-t{fill:${C.ink}}.air-t{fill:${C.signal}}
.pl{font:23px 'IBM Plex Mono',ui-monospace,monospace;fill:${C.signal};paint-order:stroke;stroke:${C.sea};stroke-width:5px}
.grid line{stroke:${C.grid};stroke-width:1}
.land{fill:${C.land};stroke:${C.coast};stroke-width:1.2;stroke-linejoin:round}
.sea{stroke:${C.ink};stroke-width:2.5;stroke-dasharray:10 7;fill:none}
.air{stroke:${C.signal};stroke-width:2.5;stroke-dasharray:2 7;stroke-linecap:round;fill:none}
.par{stroke:${C.signal};stroke-width:2}
.pt{fill:${C.signal};stroke:${C.ink};stroke-width:2}
</style>
<rect width="${width}" height="${height}" fill="${C.sea}"/>
<g class="grid">${g}</g>
<path class="land" d="${d}"/>
${par}${ln}${pt}${nt}
<rect width="${width}" height="${height}" fill="none" stroke="${C.ink}" stroke-width="2"/>
</svg>
`;
  fs.writeFileSync(path.join(OUT, `${name}.svg`), svg);
  console.log(`${name}.svg ${width}x${height} ${(svg.length / 1024).toFixed(0)} KB`);
  return { name, width, height };
}

const made = [
  chart({
    name: 'ports-routes',
    title: 'Chart of departure routes: Ushuaia to the South Shetland Islands by sea, and Punta Arenas to King George Island by air',
    bbox: [-76, -54, -50.8, -65.4],
    grid: 2,
    points: [
      { key: 'punta-arenas', anchor: 'end' },
      { key: 'ushuaia', anchor: 'end', dy: 14 },
      { key: 'stanley', label: 'Stanley', anchor: 'end' },
      { key: 'marsh-aerodrome', label: 'King George Island airstrip', anchor: 'end', dy: -10 },
      { key: 'deception-island', anchor: 'end', dy: 16 },
      { key: 'port-lockroy', anchor: 'end' },
    ],
    lines: [
      { from: 'ushuaia', to: 'deception-island', kind: 'sea', label: 'By sea ~1,008 km', dx: -250, dy: 10 },
      { from: 'punta-arenas', to: 'marsh-aerodrome', kind: 'air', label: 'By air ~1,225 km', dx: 16, dy: -8 },
    ],
    notes: ['Mercator · straight-line distances'],
  }),
  chart({
    name: 'antarctic-circle',
    title: 'Chart of the western Antarctic Peninsula showing the Antarctic Circle south of Port Lockroy and the Lemaire Channel',
    bbox: [-72, -56, -61.6, -68.6],
    grid: 1,
    parallels: [{ lat: -66.5636, label: 'Antarctic Circle ~66°34′S' }],
    points: [
      { key: 'king-george-island', label: 'King George Island' },
      { key: 'deception-island', anchor: 'end' },
      { key: 'port-lockroy', anchor: 'end' },
      { key: 'lemaire-channel', anchor: 'end', dy: 18 },
      { key: 'snow-hill-island', anchor: 'end', dy: -10 },
    ],
    notes: ['Mercator'],
  }),
  chart({
    name: 'snow-hill',
    title: 'Chart of the northern Antarctic Peninsula showing Snow Hill Island on the edge of the Weddell Sea',
    bbox: [-66, -52, -61.5, -66.2],
    grid: 1,
    points: [
      { key: 'king-george-island', label: 'King George Island' },
      { key: 'deception-island', anchor: 'end' },
      { key: 'snow-hill-island' },
      { key: 'port-lockroy', anchor: 'end' },
    ],
    notes: ['Mercator'],
  }),
];
fs.writeFileSync(path.join(OUT, 'charts.json'), JSON.stringify(Object.fromEntries(made.map((c) => [c.name, c])), null, 2) + '\n');
