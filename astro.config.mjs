import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { site } from './site.config.mjs';

export default defineConfig({
  site: site.url,
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'always' },
  compressHTML: true,
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      // Root URL with a trailing slash, to match its canonical.
      serialize: (item) => ({ ...item, url: item.url === site.url ? site.url + '/' : item.url }),
    }),
  ],
});
