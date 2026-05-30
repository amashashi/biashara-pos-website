import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://biashara-pos.com',
  output: 'static',
  // Inline ALL stylesheets into each HTML page. This kills the stale-hash
  // FOUC: GitHub Pages caches HTML for 10 min, so after a deploy old cached
  // HTML used to reference a now-deleted /_astro/index.<oldhash>.css → 404
  // → unstyled page until hard-refresh. With styles inlined there is no
  // external CSS file to 404 against, and the page is always styled on first
  // paint. Trade-off: +38 KB per HTML page (acceptable for a 6-page site).
  build: {
    inlineStylesheets: 'always',
  },
  integrations: [
    tailwind(),
    sitemap(),
  ],
});
