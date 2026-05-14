import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.weddingsmakeupandhair.com',
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
      serialize(item) {
        const path = new URL(item.url).pathname;
        // home (EN root or EL root)
        if (path === '/' || path === '/el/') {
          return { ...item, priority: 1.0, changefreq: 'weekly' };
        }
        // money pages: services + contact + bridal lounge
        if (
          path.endsWith('/services/bridal-beauty/') ||
          path.endsWith('/services/wedding-planning/') ||
          path.endsWith('/services/') ||
          path.endsWith('/bridal-lounge/') ||
          path.endsWith('/contact/')
        ) {
          return { ...item, priority: 0.9, changefreq: 'weekly' };
        }
        // discovery
        if (path.endsWith('/about/') || path.endsWith('/portfolio/')) {
          return { ...item, priority: 0.8, changefreq: 'monthly' };
        }
        // blog index
        if (path.endsWith('/blog/')) {
          return { ...item, priority: 0.7, changefreq: 'weekly' };
        }
        // individual blog posts
        if (path.includes('/blog/')) {
          return { ...item, priority: 0.6, changefreq: 'monthly' };
        }
        // legal
        if (path.endsWith('/booking-terms/')) {
          return { ...item, priority: 0.4, changefreq: 'yearly' };
        }
        return item;
      },
    }),
  ],
});
