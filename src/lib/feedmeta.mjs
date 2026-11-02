import { loadFeed } from './feed.mjs';
import { site } from '../../site.config.mjs';
import { isoDate } from './format.mjs';

/** Date of the feed export, used as "last reviewed" for feed-driven pages. */
export function feedDate() {
  const g = loadFeed().raw.generated_at;
  return g ? isoDate(g) : site.firstPublished;
}
export function feedSourceLabel() {
  const f = loadFeed();
  return `Tourground directory feed, export of ${feedDate()}${f.isMock ? ' (mock feed: the directory export does not exist yet)' : ''}`;
}
