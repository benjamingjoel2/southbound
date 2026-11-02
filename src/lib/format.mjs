import placesData from '../../content/antarctica/data/places.json' with { type: 'json' };

export const places = placesData.places;

/** 64.8253 S, 63.4946 W -> 64°49′S 063°30′W */
export function formatCoord(lat, lon) {
  const part = (v, pos, neg, pad) => {
    const a = Math.abs(v);
    let d = Math.floor(a);
    let m = Math.round((a - d) * 60);
    if (m === 60) { d += 1; m = 0; }
    return `${String(d).padStart(pad, '0')}°${String(m).padStart(2, '0')}′${v < 0 ? neg : pos}`;
  };
  return `${part(lat, 'N', 'S', 2)} ${part(lon, 'E', 'W', 3)}`;
}

export function placeCoord(key) {
  const p = places[key];
  if (!p) throw new Error(`Unknown place "${key}" (add it to content/antarctica/data/places.json)`);
  return { ...p, coord: formatCoord(p.lat, p.lon) };
}

/** ISO date (YYYY-MM-DD) from Date or string. */
export function isoDate(d) {
  const date = d instanceof Date ? d : new Date(d);
  return date.toISOString().slice(0, 10);
}

/** Log-style date: 2026-11-02 */
export const logDate = isoDate;

export function readableDate(d) {
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
