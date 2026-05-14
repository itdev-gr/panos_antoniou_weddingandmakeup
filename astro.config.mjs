import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://weddingsmakeupandhair.com',
  output: 'static',
  trailingSlash: 'ignore',
  compressHTML: true,
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'el'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  build: {
    inlineStylesheets: 'auto',
    assets: '_astro',
  },
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/admin'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-GB',
          el: 'el-GR',
        },
      },
    }),
  ],
});
