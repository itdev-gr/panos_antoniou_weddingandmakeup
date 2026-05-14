# Bilingual EN/EL Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Phase 1 tasks (page translations) are independent and SHOULD be dispatched in parallel via superpowers:dispatching-parallel-agents.

**Goal:** Make the Astro site bilingual (English at `/`, Greek at `/el/...`) with a navbar EN/EL toggle and full content translation.

**Architecture:** Astro's built-in i18n (`prefixDefaultLocale: false`) routes EN at root and EL under `/el/`. Each page's content lives in a single Section component under `src/components/pages/`, which is mounted by 3-line shell files at both `pages/foo.astro` and `pages/el/foo.astro`. Sections read `Astro.currentLocale` and pull strings from per-page dictionaries in `src/i18n/{en,el}/<namespace>.ts`. Splitting the dictionary per namespace avoids merge conflicts when many agents work in parallel.

**Tech Stack:** Astro 5, TypeScript, Tailwind. No new dependencies.

---

## Tone & Translation Style Guide

Whenever translating English copy to Greek, follow this guide:

- **Brand register:** Luxury, romantic, editorial. Avoid casual phrasing.
- **Person:** Polite plural ("εσείς"). Address the bride/couple respectfully.
- **No Greeklish.** Use proper Greek with accents.
- **Keep proper nouns in English:** "Panos Antoniou", "MAC Cosmetics", "Balenciaga", "Santorini" (acceptable to render as "Σαντορίνη" — prefer Greek), "Mykonos" → "Μύκονος", "Athens" → "Αθήνα".
- **Service names:** Keep the marketed English name in parentheses where it's a brand term ("Full Bridal Beauty (Πλήρης Νυφική Ομορφιά)") OR translate cleanly. Stay consistent within a page.
- **Prices:** Always render as `€X,XXX` (Euro symbol, comma thousands). Greek convention also accepts `X.XXX €` — DO NOT use this; keep English-style for visual consistency.
- **Currency phrasing:** "Starting from €560" → "Από €560".
- **Punctuation:** Use Greek quotation marks «...» when quoting; use em-dash — for asides. Use Greek question mark `;` (looks like `;`) where punctuation is needed.
- **CTAs:** Keep short and imperative: "Book Your Date" → "Κλείστε Ημερομηνία", "Learn More" → "Μάθετε Περισσότερα", "Get in Touch" → "Επικοινωνήστε".

When uncertain, prefer the slightly more formal phrasing.

---

## File Structure (all files this plan touches)

### Created files

```
src/i18n/
├── utils.ts                      ← getLangFromUrl, useTranslations, getLocalizedPath
├── en/
│   ├── common.ts                 ← header nav, footer, language switcher, shared
│   ├── home.ts                   ← all home-page sections
│   ├── about.ts
│   ├── services-index.ts         ← /services landing page
│   ├── bridal-beauty.ts          ← /services/bridal-beauty
│   ├── wedding-planning.ts       ← /services/wedding-planning
│   ├── bridal-lounge.ts
│   ├── portfolio.ts
│   ├── contact.ts
│   ├── booking-terms.ts
│   ├── blog.ts                   ← blog index + 3 posts
│   └── data.ts                   ← labels for services/testimonials/portfolio data
└── el/
    └── (mirror of en/, same filenames)

src/components/global/
└── LanguageSwitcher.astro        ← EN/EL toggle UI

src/components/pages/             ← Section components (one per page)
├── HomePage.astro
├── AboutPage.astro
├── ServicesIndexPage.astro
├── BridalBeautyPage.astro
├── WeddingPlanningPage.astro
├── BridalLoungePage.astro
├── PortfolioPage.astro
├── ContactPage.astro
├── BookingTermsPage.astro
├── BlogIndexPage.astro
├── BlogWeddingBeauticianPage.astro
├── BlogBestWeddingMakeupServicesPage.astro
└── BlogSantoriniDreamWeddingPage.astro

src/pages/el/                     ← Greek-route mirror (thin shells)
├── index.astro
├── about.astro
├── bridal-lounge.astro
├── booking-terms.astro
├── contact.astro
├── portfolio.astro
├── services/
│   ├── index.astro
│   ├── bridal-beauty.astro
│   └── wedding-planning.astro
└── blog/
    ├── index.astro
    ├── wedding-beautician.astro
    ├── best-wedding-makeup-services.astro
    └── santorini-dream-wedding.astro
```

### Modified files

- `astro.config.mjs` — add `i18n` block, update `sitemap` config
- `src/layouts/BaseLayout.astro` — dynamic `lang` + hreflang links
- `src/layouts/PageLayout.astro` — accept and forward `lang`
- `src/components/global/Header.astro` — use translations, include LanguageSwitcher
- `src/components/global/Footer.astro` — use translations (legal block stays bilingual permanently)
- `src/components/home/Hero.astro`, `Visionary.astro`, `ServicesQuickView.astro`, `BridalLoungeTeaser.astro`, `InstagramFeed.astro`, `CTABanner.astro` — read from i18n
- `src/data/services.ts`, `testimonials.ts`, `portfolio.ts` — keep neutral data (paths, prices) only; translatable labels move into i18n
- All `src/pages/*.astro` and `src/pages/services/*.astro` — slim down to thin shells importing from `src/components/pages/*`

---

## Tech Notes (read before starting)

1. **Astro `i18n` config** with `prefixDefaultLocale: false` keeps EN at `/` and serves EL at `/el/...`. `Astro.currentLocale` returns `'en'` or `'el'` based on the URL.
2. **`Astro.currentLocale` in component children**: when a section component is imported by `src/pages/el/about.astro`, `Astro.currentLocale` inside that component evaluates to `'el'`. This is how a single Section file serves both routes.
3. **Static output:** the site is `output: 'static'` — Astro generates `dist/about/index.html` and `dist/el/about/index.html` separately. No runtime locale switching needed.
4. **Language switcher logic:** swap the current pathname's locale prefix. For `/about` → toggle gives `/el/about`. For `/el/about` → toggle gives `/about`. The switcher is rendered in the Header and computes the target href from `Astro.url.pathname`.
5. **Sitemap:** `@astrojs/sitemap` 3.x respects Astro's `i18n` config and emits alternates automatically once `i18n` is set on the integration.
6. **JSON-LD `inLanguage`:** add `"inLanguage"` per page in BaseLayout's LocalBusiness schema based on current locale.

---

## Phase 0 — Foundation (sequential, single agent)

Phase 0 must complete and merge before Phase 1 parallel agents start. Each task in Phase 0 is small and standalone with its own commit.

---

### Task 0.1: Configure Astro i18n + sitemap

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: Edit `astro.config.mjs`**

Replace the file contents with:

```js
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
```

- [ ] **Step 2: Verify dev server starts**

Run: `npm run dev` (or check the existing background process). Visit `http://localhost:4321/` and `http://localhost:4321/el/` — the EL URL should 404 (no pages there yet, expected). The EN URL must still render normally.

- [ ] **Step 3: Commit**

```bash
git add astro.config.mjs
git commit -m "feat(i18n): enable Astro i18n with EN default and EL prefix"
```

---

### Task 0.2: Translation utility module

**Files:**
- Create: `src/i18n/utils.ts`

- [ ] **Step 1: Create `src/i18n/utils.ts`**

```ts
export const LOCALES = ['en', 'el'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(value: string | undefined): value is Locale {
  return value === 'en' || value === 'el';
}

export function getLangFromUrl(url: URL): Locale {
  const first = url.pathname.split('/').filter(Boolean)[0];
  return isLocale(first) ? first : DEFAULT_LOCALE;
}

/**
 * Returns a typed translator bound to a dictionary tree.
 *
 * Usage in a .astro file:
 *   import { useTranslations } from '../../i18n/utils';
 *   import { home } from '../../i18n';
 *   const lang = Astro.currentLocale ?? 'en';
 *   const t = useTranslations(home, lang);
 *   <h1>{t('hero.title')}</h1>
 */
export function useTranslations<T extends Record<Locale, Record<string, unknown>>>(
  dict: T,
  lang: Locale,
) {
  const tree = dict[lang] ?? dict[DEFAULT_LOCALE];
  return function t(key: string): string {
    const parts = key.split('.');
    let cur: unknown = tree;
    for (const p of parts) {
      if (cur && typeof cur === 'object' && p in (cur as Record<string, unknown>)) {
        cur = (cur as Record<string, unknown>)[p];
      } else {
        if (import.meta.env.DEV) console.warn(`[i18n] missing key "${key}" for "${lang}"`);
        return key;
      }
    }
    if (typeof cur === 'string') return cur;
    if (import.meta.env.DEV) console.warn(`[i18n] key "${key}" is not a string for "${lang}"`);
    return key;
  };
}

/**
 * Returns the value at `key` whatever its type (array, object, string).
 * Use when the dict value is a list (e.g. timeline items).
 */
export function getEntry<T = unknown>(
  dict: Record<Locale, Record<string, unknown>>,
  lang: Locale,
  key: string,
): T {
  const tree = dict[lang] ?? dict[DEFAULT_LOCALE];
  const parts = key.split('.');
  let cur: unknown = tree;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      throw new Error(`[i18n] missing key "${key}" for "${lang}"`);
    }
  }
  return cur as T;
}

/**
 * Returns the locale-prefixed path for an internal route.
 *   localizedPath('/about', 'en') -> '/about'
 *   localizedPath('/about', 'el') -> '/el/about'
 *   localizedPath('/', 'el')      -> '/el/'
 */
export function localizedPath(path: string, lang: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === DEFAULT_LOCALE) return clean;
  if (clean === '/') return '/el/';
  return `/el${clean}`;
}

/**
 * Given the current URL pathname, return the pathname under the other locale.
 *   altLocalePath('/about', 'el')    -> '/el/about'
 *   altLocalePath('/el/about', 'en') -> '/about'
 */
export function altLocalePath(pathname: string, targetLang: Locale): string {
  const segments = pathname.split('/').filter(Boolean);
  const stripped = isLocale(segments[0]) ? segments.slice(1) : segments;
  const rest = stripped.join('/');
  if (targetLang === DEFAULT_LOCALE) {
    return rest ? `/${rest}` : '/';
  }
  return rest ? `/el/${rest}` : '/el/';
}
```

- [ ] **Step 2: Commit**

```bash
git add src/i18n/utils.ts
git commit -m "feat(i18n): add translation utility helpers"
```

---

### Task 0.3: Common dictionary (header, footer, switcher)

**Files:**
- Create: `src/i18n/en/common.ts`
- Create: `src/i18n/el/common.ts`
- Create: `src/i18n/index.ts`

- [ ] **Step 1: Create `src/i18n/en/common.ts`**

```ts
export default {
  nav: {
    about: 'About',
    services: 'Services',
    bridalLounge: 'The Bridal Lounge',
    portfolio: 'Portfolio',
    blog: 'Blog',
    contact: 'Contact',
    bookingTerms: 'Booking Terms',
  },
  cta: {
    bookYourDate: 'Book Your Date',
    bookConsultation: 'Book a Consultation',
    learnMore: 'Learn More',
    getInTouch: 'Get in Touch',
    checkAvailability: 'Check Availability',
    viewDetails: 'View Details',
    viewServices: 'View Services',
    explore: 'Explore the Lounge',
    followInstagram: 'Follow Us on Instagram',
  },
  footer: {
    navigate: 'Navigate',
    services: 'Services',
    contact: 'Contact',
    weTravelTo: 'We Travel To',
    follow: 'Follow',
    top: 'Top',
    tagline: 'Crafting timeless elegance and bespoke wedding experiences since 1998',
    copyright: 'All rights reserved.',
    designedBy: 'Designed & Developed by',
    downloadPricelist: 'Download Pricelist (PDF)',
    bridalMakeupHair: 'Bridal Makeup & Hair',
    weddingPlanning: 'Wedding Planning',
    office: 'Office',
    legalHeadingEl: 'Στοιχεία Επιχείρησης',
    legalHeadingEn: 'Company Information',
  },
  switcher: {
    label: 'Language',
    en: 'EN',
    el: 'EL',
    longEn: 'English',
    longEl: 'Ελληνικά',
  },
  locations: {
    santorini: 'Santorini',
    mykonos: 'Mykonos',
    athens: 'Athens',
    greece: 'Greece',
    worldwide: 'Worldwide',
  },
};
```

- [ ] **Step 2: Create `src/i18n/el/common.ts`**

```ts
export default {
  nav: {
    about: 'Σχετικά',
    services: 'Υπηρεσίες',
    bridalLounge: 'The Bridal Lounge',
    portfolio: 'Portfolio',
    blog: 'Blog',
    contact: 'Επικοινωνία',
    bookingTerms: 'Όροι Κράτησης',
  },
  cta: {
    bookYourDate: 'Κλείστε Ημερομηνία',
    bookConsultation: 'Κλείστε Ραντεβού',
    learnMore: 'Μάθετε Περισσότερα',
    getInTouch: 'Επικοινωνήστε',
    checkAvailability: 'Δείτε Διαθεσιμότητα',
    viewDetails: 'Δείτε Λεπτομέρειες',
    viewServices: 'Δείτε Υπηρεσίες',
    explore: 'Ανακαλύψτε τον Χώρο',
    followInstagram: 'Ακολουθήστε μας στο Instagram',
  },
  footer: {
    navigate: 'Πλοήγηση',
    services: 'Υπηρεσίες',
    contact: 'Επικοινωνία',
    weTravelTo: 'Ταξιδεύουμε σε',
    follow: 'Ακολουθήστε',
    top: 'Επάνω',
    tagline: 'Χτίζουμε διαχρονική κομψότητα και προσαρμοσμένες γαμήλιες εμπειρίες από το 1998',
    copyright: 'Με επιφύλαξη παντός νόμιμου δικαιώματος.',
    designedBy: 'Σχεδίαση & Ανάπτυξη από',
    downloadPricelist: 'Κατεβάστε τον Τιμοκατάλογο (PDF)',
    bridalMakeupHair: 'Νυφικό Μακιγιάζ & Κόμμωση',
    weddingPlanning: 'Διοργάνωση Γάμου',
    office: 'Γραφείο',
    legalHeadingEl: 'Στοιχεία Επιχείρησης',
    legalHeadingEn: 'Company Information',
  },
  switcher: {
    label: 'Γλώσσα',
    en: 'EN',
    el: 'EL',
    longEn: 'English',
    longEl: 'Ελληνικά',
  },
  locations: {
    santorini: 'Σαντορίνη',
    mykonos: 'Μύκονος',
    athens: 'Αθήνα',
    greece: 'Ελλάδα',
    worldwide: 'Παγκοσμίως',
  },
};
```

- [ ] **Step 3: Create `src/i18n/index.ts`** (barrel that combines en + el for each namespace)

```ts
import enCommon from './en/common';
import elCommon from './el/common';

export const common = { en: enCommon, el: elCommon };

// Additional namespaces will be appended here by Phase 1 tasks.
// Keep this file as the single import surface; Phase 1 agents MUST add their
// namespace export here in their own commit.
```

- [ ] **Step 4: Commit**

```bash
git add src/i18n/
git commit -m "feat(i18n): add common dictionary (nav, footer, cta, switcher)"
```

---

### Task 0.4: LanguageSwitcher component

**Files:**
- Create: `src/components/global/LanguageSwitcher.astro`

- [ ] **Step 1: Create the component**

```astro
---
import { altLocalePath, isLocale, type Locale } from '../../i18n/utils';
import { common } from '../../i18n';

interface Props {
  variant?: 'desktop' | 'mobile';
  onDark?: boolean;
}
const { variant = 'desktop', onDark = false } = Astro.props;

const currentLocale: Locale = isLocale(Astro.currentLocale) ? Astro.currentLocale : 'en';
const otherLocale: Locale = currentLocale === 'en' ? 'el' : 'en';

const enHref = altLocalePath(Astro.url.pathname, 'en');
const elHref = altLocalePath(Astro.url.pathname, 'el');

const tCurrent = common[currentLocale].switcher;
---

{variant === 'desktop' && (
  <div
    class:list={[
      'flex items-center gap-1 text-[11px] font-sans font-medium tracking-[0.18em] uppercase',
      onDark ? 'text-white/70' : 'text-forest-green/80',
    ]}
    aria-label={tCurrent.label}
  >
    <a
      href={enHref}
      aria-current={currentLocale === 'en' ? 'true' : undefined}
      class:list={[
        'px-1.5 py-1 transition-colors duration-300',
        currentLocale === 'en'
          ? (onDark ? 'text-white' : 'text-forest-green')
          : (onDark ? 'hover:text-white' : 'hover:text-forest-green'),
        currentLocale === 'en' && 'underline underline-offset-4 decoration-gold/70',
      ]}
    >EN</a>
    <span class:list={[onDark ? 'text-white/30' : 'text-forest-green/30']}>/</span>
    <a
      href={elHref}
      aria-current={currentLocale === 'el' ? 'true' : undefined}
      class:list={[
        'px-1.5 py-1 transition-colors duration-300',
        currentLocale === 'el'
          ? (onDark ? 'text-white' : 'text-forest-green')
          : (onDark ? 'hover:text-white' : 'hover:text-forest-green'),
        currentLocale === 'el' && 'underline underline-offset-4 decoration-gold/70',
      ]}
    >EL</a>
  </div>
)}

{variant === 'mobile' && (
  <div class="flex items-center gap-2 text-sm font-sans font-medium tracking-widest uppercase text-charcoal/80" aria-label={tCurrent.label}>
    <a
      href={enHref}
      aria-current={currentLocale === 'en' ? 'true' : undefined}
      class:list={[
        'px-3 py-2 border rounded-sm transition-colors duration-300',
        currentLocale === 'en' ? 'bg-forest-green text-white border-forest-green' : 'border-gray-200 hover:border-forest-green',
      ]}
    >EN</a>
    <a
      href={elHref}
      aria-current={currentLocale === 'el' ? 'true' : undefined}
      class:list={[
        'px-3 py-2 border rounded-sm transition-colors duration-300',
        currentLocale === 'el' ? 'bg-forest-green text-white border-forest-green' : 'border-gray-200 hover:border-forest-green',
      ]}
    >EL</a>
  </div>
)}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/global/LanguageSwitcher.astro
git commit -m "feat(i18n): add EN/EL language switcher component"
```

---

### Task 0.5: BaseLayout — dynamic lang + hreflang + JSON-LD inLanguage

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Replace BaseLayout content**

```astro
---
import '../styles/global.css';
import { isLocale, altLocalePath, type Locale } from '../i18n/utils';

interface Props {
  title: string;
  description?: string;
  image?: string;
}

const { title, description = "Luxury bridal makeup & hair services in Santorini, Mykonos, Athens & worldwide. 26+ years of experience crafting unforgettable wedding looks.", image = "/images/logo/panos-logo.png" } = Astro.props;

const currentLocale: Locale = isLocale(Astro.currentLocale) ? Astro.currentLocale : 'en';
const htmlLang = currentLocale === 'el' ? 'el-GR' : 'en-GB';

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
const altEnUrl = new URL(altLocalePath(Astro.url.pathname, 'en'), Astro.site);
const altElUrl = new URL(altLocalePath(Astro.url.pathname, 'el'), Astro.site);
---

<!DOCTYPE html>
<html lang={htmlLang}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/png" href="/images/logo/panos-logo.png" />
    <link rel="canonical" href={canonicalURL} />

    <link rel="alternate" hreflang="en" href={altEnUrl} />
    <link rel="alternate" hreflang="el" href={altElUrl} />
    <link rel="alternate" hreflang="x-default" href={altEnUrl} />

    <title>{title}</title>
    <meta name="description" content={description} />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={new URL(image, Astro.site).href} />
    <meta property="og:locale" content={htmlLang.replace('-', '_')} />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />

    <!-- JSON-LD -->
    <script type="application/ld+json" set:html={JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Panos Antoniou - Weddings Makeup & Hair",
      "description": description,
      "inLanguage": htmlLang,
      "telephone": "+30-695-562-8019",
      "email": "events@weddingsmakeupandhair.com",
      "url": "https://weddingsmakeupandhair.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Pyrgos Village",
        "addressRegion": "Santorini",
        "addressCountry": "GR"
      },
      "areaServed": ["Santorini", "Mykonos", "Athens", "Greece", "Worldwide"],
      "priceRange": "$$$$"
    })} />
  </head>
  <body class="min-h-screen">
    <slot />

    <!-- Scroll Reveal Observer -->
    <script>
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );
      document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
    </script>
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat(i18n): dynamic html lang, hreflang alternates, JSON-LD inLanguage"
```

---

### Task 0.6: Refactor Header to use i18n + insert LanguageSwitcher

**Files:**
- Modify: `src/components/global/Header.astro`

- [ ] **Step 1: Replace the Header frontmatter and nav rendering**

Replace the entire `Header.astro` file with:

```astro
---
import { isLocale, localizedPath, type Locale } from '../../i18n/utils';
import { common } from '../../i18n';
import LanguageSwitcher from './LanguageSwitcher.astro';

interface Props {
  transparent?: boolean;
}
const { transparent = false } = Astro.props;

const lang: Locale = isLocale(Astro.currentLocale) ? Astro.currentLocale : 'en';
const t = common[lang];

const navLinks = [
  { label: t.nav.about, href: localizedPath('/about', lang) },
  { label: t.nav.services, href: localizedPath('/services', lang) },
  { label: t.nav.bridalLounge, href: localizedPath('/bridal-lounge', lang) },
  { label: t.nav.portfolio, href: localizedPath('/portfolio', lang) },
  { label: t.nav.blog, href: localizedPath('/blog', lang) },
];

const contactHref = localizedPath('/contact', lang);
const homeHref = localizedPath('/', lang);
---

<header
  id="main-header"
  class:list={[
    "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
    transparent ? "header-transparent" : "bg-white/95 backdrop-blur-md shadow-sm",
  ]}
>
  <div class="container-content flex items-center justify-between px-5 py-3 lg:px-10 lg:py-4">
    <a href={homeHref} class="flex items-center gap-3 group">
      <img
        id="header-logo"
        src="/images/logo/panos-logo.png"
        alt="Panos Antoniou"
        class:list={[
          "h-20 lg:h-24 w-auto transition-all duration-300 group-hover:scale-105",
          transparent ? "brightness-0 invert" : "brightness-0",
        ]}
      />
    </a>

    <nav class="hidden lg:flex items-center gap-9">
      {navLinks.map((link) => (
        <a
          href={link.href}
          class:list={[
            "text-sm font-sans font-medium tracking-widest-plus uppercase transition-colors duration-300",
            transparent ? "text-white/90 hover:text-white" : "text-forest-green hover:text-green-light",
          ]}
        >
          {link.label}
        </a>
      ))}
    </nav>

    <div class="flex items-center gap-4">
      <div class="hidden lg:block">
        <LanguageSwitcher variant="desktop" onDark={transparent} />
      </div>
      <a
        href={contactHref}
        class:list={[
          "hidden md:inline-flex px-7 py-3 text-sm font-sans font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm shadow-lg hover:shadow-xl hover:scale-105",
          transparent
            ? "bg-white text-forest-green hover:bg-gold hover:text-white"
            : "bg-forest-green text-white hover:bg-gold hover:text-white",
        ]}
      >
        {t.cta.bookYourDate}
      </a>

      <button
        id="mobile-menu-btn"
        class="lg:hidden flex flex-col gap-1.5 p-2"
        aria-label="Open menu"
      >
        <span class:list={["block w-6 h-px transition-all duration-300", transparent ? "bg-white" : "bg-charcoal"]} />
        <span class:list={["block w-4 h-px transition-all duration-300 ml-auto", transparent ? "bg-white" : "bg-charcoal"]} />
        <span class:list={["block w-6 h-px transition-all duration-300", transparent ? "bg-white" : "bg-charcoal"]} />
      </button>
    </div>
  </div>
</header>

<!-- Mobile Nav Drawer -->
<div
  id="mobile-nav"
  class="fixed inset-0 z-[60] pointer-events-none opacity-0 transition-opacity duration-300"
>
  <div class="absolute inset-0 bg-near-black/50" id="mobile-nav-backdrop"></div>
  <div
    id="mobile-nav-panel"
    class="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white transform translate-x-full transition-transform duration-500 ease-out shadow-2xl"
  >
    <div class="flex flex-col h-full p-8">
      <button id="mobile-nav-close" class="self-end p-2 mb-8" aria-label="Close menu">
        <svg class="w-6 h-6 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <nav class="flex flex-col gap-1">
        {navLinks.map((link) => (
          <a
            href={link.href}
            class="text-lg font-serif italic text-charcoal/80 hover:text-charcoal py-3 border-b border-gray-100 transition-colors duration-200"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div class="mt-6 pt-6 border-t border-gray-100">
        <LanguageSwitcher variant="mobile" />
      </div>

      <div class="mt-auto pt-8">
        <a
          href={contactHref}
          class="block text-center px-6 py-3 bg-forest-green text-white text-xs font-sans font-medium tracking-widest uppercase rounded-sm hover:bg-green-light transition-colors duration-300"
        >
          {t.cta.bookYourDate}
        </a>
        <div class="flex justify-center gap-6 mt-6">
          <a href="https://instagram.com/weddingsmakeupandhair" target="_blank" rel="noopener" class="text-grey hover:text-forest-green transition-colors" aria-label="Instagram">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
          <a href="https://www.facebook.com/panosantoniouweddingsmakeupandhair/" target="_blank" rel="noopener" class="text-grey hover:text-forest-green transition-colors" aria-label="Facebook">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="https://www.tiktok.com/@panosantoniouweddings" target="_blank" rel="noopener" class="text-grey hover:text-forest-green transition-colors" aria-label="TikTok">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
  const btn = document.getElementById('mobile-menu-btn');
  const nav = document.getElementById('mobile-nav');
  const panel = document.getElementById('mobile-nav-panel');
  const closeBtn = document.getElementById('mobile-nav-close');
  const backdrop = document.getElementById('mobile-nav-backdrop');

  function openNav() {
    nav?.classList.remove('pointer-events-none', 'opacity-0');
    panel?.classList.remove('translate-x-full');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    panel?.classList.add('translate-x-full');
    nav?.classList.add('opacity-0');
    setTimeout(() => {
      nav?.classList.add('pointer-events-none');
      document.body.style.overflow = '';
    }, 300);
  }

  btn?.addEventListener('click', openNav);
  closeBtn?.addEventListener('click', closeNav);
  backdrop?.addEventListener('click', closeNav);

  const header = document.getElementById('main-header');
  if (header?.classList.contains('header-transparent')) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) {
        header.classList.add('bg-white/95', 'backdrop-blur-md', 'shadow-sm');
        header.classList.remove('header-transparent');
        header.querySelectorAll('nav a').forEach((el) => {
          el.classList.remove('text-white/90', 'text-white/80', 'text-white', 'hover:text-white');
          el.classList.add('text-forest-green', 'hover:text-green-light');
        });
        const bookBtn = header.querySelector('a[href$="/contact"], a[href$="/el/contact"]');
        if (bookBtn) {
          bookBtn.classList.remove('bg-white', 'text-forest-green', 'hover:bg-gold', 'hover:text-white');
          bookBtn.classList.add('bg-forest-green', 'text-white', 'hover:bg-gold', 'hover:text-white');
        }
        header.querySelectorAll('#mobile-menu-btn span').forEach((el) => {
          el.classList.remove('bg-white');
          el.classList.add('bg-charcoal');
        });
        const logo = document.getElementById('header-logo');
        logo?.classList.remove('invert');
        logo?.classList.add('brightness-0');
      } else {
        header.classList.remove('bg-white/95', 'backdrop-blur-md', 'shadow-sm');
        header.classList.add('header-transparent');
        header.querySelectorAll('nav a').forEach((el) => {
          el.classList.remove('text-forest-green', 'hover:text-green-light');
          el.classList.add('text-white/90', 'hover:text-white');
        });
        const bookBtnRestore = header.querySelector('a[href$="/contact"], a[href$="/el/contact"]');
        if (bookBtnRestore) {
          bookBtnRestore.classList.remove('bg-forest-green', 'text-white');
          bookBtnRestore.classList.add('bg-white', 'text-forest-green');
        }
        header.querySelectorAll('#mobile-menu-btn span').forEach((el) => {
          el.classList.remove('bg-charcoal');
          el.classList.add('bg-white');
        });
        const logoRestore = document.getElementById('header-logo');
        logoRestore?.classList.add('brightness-0', 'invert');
      }
    });
  }
</script>
```

- [ ] **Step 2: Verify EN site still renders**

Visit `http://localhost:4321/`. Confirm header shows EN/EL toggle. Click EL — it should attempt `/el/` (will 404 until Phase 1 home page task runs; that's expected).

- [ ] **Step 3: Commit**

```bash
git add src/components/global/Header.astro
git commit -m "feat(i18n): header reads from dict and shows EN/EL toggle"
```

---

### Task 0.7: Refactor Footer to use i18n

**Files:**
- Modify: `src/components/global/Footer.astro`

- [ ] **Step 1: Replace Footer frontmatter**

Replace the Footer frontmatter and refactor the JSX so every hard-coded English string reads from `t.footer.*` / `t.nav.*` / `t.cta.*` / `t.locations.*`. The legal block (Greek + English) stays bilingual on every page regardless of locale — those headings come from `t.footer.legalHeadingEl` and `t.footer.legalHeadingEn` which exist in both dictionaries.

Replace the file with:

```astro
---
import { isLocale, localizedPath, type Locale } from '../../i18n/utils';
import { common } from '../../i18n';

const lang: Locale = isLocale(Astro.currentLocale) ? Astro.currentLocale : 'en';
const t = common[lang];

const navLinks = [
  { label: t.nav.about, href: localizedPath('/about', lang) },
  { label: t.nav.services, href: localizedPath('/services', lang) },
  { label: t.nav.bridalLounge, href: localizedPath('/bridal-lounge', lang) },
  { label: t.nav.portfolio, href: localizedPath('/portfolio', lang) },
  { label: t.nav.blog, href: localizedPath('/blog', lang) },
  { label: t.nav.contact, href: localizedPath('/contact', lang) },
  { label: t.nav.bookingTerms, href: localizedPath('/booking-terms', lang) },
];

const serviceLinks = [
  { label: t.footer.bridalMakeupHair, href: localizedPath('/services/bridal-beauty', lang) },
  { label: t.footer.weddingPlanning, href: localizedPath('/services/wedding-planning', lang) },
  { label: t.nav.bridalLounge, href: localizedPath('/bridal-lounge', lang) },
  { label: t.footer.downloadPricelist, href: '/brochure/panos-antoniou-pricelist.pdf', download: true },
];

const locations = [
  t.locations.santorini,
  t.locations.mykonos,
  t.locations.athens,
  t.locations.greece,
  t.locations.worldwide,
];
---

<footer class="bg-near-black text-white/90 relative overflow-hidden">
  <div class="absolute inset-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;4&quot; height=&quot;4&quot; viewBox=&quot;0 0 4 4&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cpath d=&quot;M1 3h1v1H1V3zm2-2h1v1H3V1z&quot; fill=&quot;%23ffffff&quot; fill-opacity=&quot;1&quot; fill-rule=&quot;evenodd&quot;/%3E%3C/svg%3E');"></div>

  <div class="relative flex items-center justify-center py-0">
    <div class="w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"></div>
  </div>

  <div class="relative pt-16 pb-12 lg:pt-20 lg:pb-14 text-center px-6">
    <a href={localizedPath('/', lang)} class="inline-block mb-5 group">
      <img
        src="/images/logo/panos-logo.png"
        alt="Panos Antoniou"
        class="h-14 w-auto brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity duration-500"
      />
    </a>
    <p class="text-lg md:text-xl font-serif italic text-white/85 max-w-md mx-auto leading-relaxed">
      {t.footer.tagline}
    </p>
    <div class="flex items-center justify-center gap-3 mt-8">
      <div class="w-12 h-px bg-gold/30"></div>
      <div class="w-1.5 h-1.5 rounded-full border border-gold/40"></div>
      <div class="w-12 h-px bg-gold/30"></div>
    </div>
  </div>

  <div class="relative container-content px-6 lg:px-12 pb-16">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
      <div>
        <h4 class="text-[10px] font-sans font-medium tracking-ultra-wide uppercase text-gold mb-5">
          {t.footer.navigate}
        </h4>
        <ul class="space-y-2.5">
          {navLinks.map((link) => (
            <li>
              <a href={link.href} class="text-sm text-white/75 hover:text-white transition-colors duration-300 inline-block">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 class="text-[10px] font-sans font-medium tracking-ultra-wide uppercase text-gold mb-5">
          {t.footer.services}
        </h4>
        <ul class="space-y-2.5">
          {serviceLinks.map((link) => (
            <li>
              <a href={link.href} download={link.download} class="text-sm text-white/75 hover:text-white transition-colors duration-300 inline-block">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 class="text-[10px] font-sans font-medium tracking-ultra-wide uppercase text-gold mb-5">
          {t.footer.contact}
        </h4>
        <ul class="space-y-3">
          <li>
            <a href="tel:+306955628019" class="text-sm text-white/75 hover:text-white transition-colors duration-300 flex items-start gap-2.5 group">
              <svg class="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gold/80 group-hover:text-gold transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <span>+30 695 562 8019</span>
            </a>
          </li>
          <li>
            <a href="mailto:events@weddingsmakeupandhair.com" class="text-sm text-white/75 hover:text-white transition-colors duration-300 flex items-start gap-2.5 group">
              <svg class="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gold/80 group-hover:text-gold transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <span class="break-all">events@weddings<wbr/>makeupandhair.com</span>
            </a>
          </li>
          <li>
            <a href="https://wa.me/306955628019" target="_blank" rel="noopener" class="text-sm text-white/75 hover:text-white transition-colors duration-300 flex items-start gap-2.5 group">
              <svg class="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gold/80 group-hover:text-gold transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>WhatsApp</span>
            </a>
          </li>
          <li>
            <a href="tel:+302286022940" class="text-sm text-white/75 hover:text-white transition-colors duration-300 flex items-start gap-2.5 group">
              <svg class="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gold/80 group-hover:text-gold transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5M3.75 3v18m16.5-18v18M5.25 3h13.5M5.25 21h13.5M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
              <span>+30 22860 22940 ({t.footer.office})</span>
            </a>
          </li>
        </ul>
      </div>

      <div>
        <h4 class="text-[10px] font-sans font-medium tracking-ultra-wide uppercase text-gold mb-5">
          {t.footer.weTravelTo}
        </h4>
        <ul class="space-y-2.5">
          {locations.map((loc) => (
            <li class="text-sm text-white/75 flex items-center gap-2">
              <div class="w-1 h-1 rounded-full bg-gold/60 flex-shrink-0"></div>
              {loc}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>

  <div class="relative border-t border-white/[0.12]">
    <div class="container-content px-6 lg:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
      <div class="flex items-center gap-6">
        <span class="text-[10px] font-sans tracking-ultra-wide uppercase text-white/50 hidden sm:block">{t.footer.follow}</span>
        <div class="flex items-center gap-4">
          <a href="https://instagram.com/weddingsmakeupandhair" target="_blank" rel="noopener" class="group flex items-center gap-2 text-white/60 hover:text-white/90 transition-all duration-300" aria-label="Instagram">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            <span class="text-xs tracking-wider hidden sm:block">Instagram</span>
          </a>
          <div class="w-px h-3 bg-white/20"></div>
          <a href="https://www.facebook.com/panosantoniouweddingsmakeupandhair/" target="_blank" rel="noopener" class="group flex items-center gap-2 text-white/60 hover:text-white/90 transition-all duration-300" aria-label="Facebook">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            <span class="text-xs tracking-wider hidden sm:block">Facebook</span>
          </a>
          <div class="w-px h-3 bg-white/20"></div>
          <a href="https://wa.me/306955628019" target="_blank" rel="noopener" class="group flex items-center gap-2 text-white/60 hover:text-white/90 transition-all duration-300" aria-label="WhatsApp">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            <span class="text-xs tracking-wider hidden sm:block">WhatsApp</span>
          </a>
          <div class="w-px h-3 bg-white/20"></div>
          <a href="https://www.tiktok.com/@panosantoniouweddings" target="_blank" rel="noopener" class="group flex items-center gap-2 text-white/60 hover:text-white/90 transition-all duration-300" aria-label="TikTok">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
            <span class="text-xs tracking-wider hidden sm:block">TikTok</span>
          </a>
        </div>
      </div>

      <button id="back-to-top" class="flex items-center gap-2 text-white/50 hover:text-white/60 transition-colors duration-300 group" aria-label="Back to top">
        <span class="text-[10px] font-sans tracking-ultra-wide uppercase">{t.footer.top}</span>
        <svg class="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
      </button>
    </div>
  </div>

  <!-- Legal / Company Information (bilingual, always shown) -->
  <div class="relative border-t border-white/[0.10]">
    <div class="container-content px-6 lg:px-12 py-6">
      <div class="grid md:grid-cols-2 gap-5 md:gap-10 text-center md:text-left max-w-3xl mx-auto">
        <div>
          <p class="text-[9px] font-sans font-medium tracking-ultra-wide uppercase text-gold/70 mb-2">
            {t.footer.legalHeadingEl}
          </p>
          <p class="text-[11px] text-white/55 leading-relaxed">
            ΠΑΝΑΓΙΩΤΗΣ ΑΣΤΕΡΙΟΥ ΑΝΤΩΝΙΟΥ<br />
            Άλλες Υπηρεσίες Καλλωπισμού | Οργάνωση Γάμων<br />
            Τηλ. +30 6955 628019<br />
            ΑΦΜ 108858849 &mdash; ΔΟΥ Θήρας<br />
            Αρ. ΓΕΜΗ 193542738000
          </p>
        </div>
        <div>
          <p class="text-[9px] font-sans font-medium tracking-ultra-wide uppercase text-gold/70 mb-2">
            {t.footer.legalHeadingEn}
          </p>
          <p class="text-[11px] text-white/55 leading-relaxed">
            PANAGIOTIS ASTERIOU ANTONIOU<br />
            Wedding Planning &amp; Beauty Services<br />
            Tel. +30 6955 628019<br />
            VAT No: EL108858849 &mdash; Tax Office: Thira<br />
            G.C.R. No (GEMI): 193542738000
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="relative border-t border-white/[0.10]">
    <div class="container-content px-6 lg:px-12 py-5">
      <p class="text-[11px] text-white/50 text-center tracking-wider">
        &copy; {new Date().getFullYear()} Panos Antoniou &mdash; Weddings Makeup & Hair. {t.footer.copyright}
      </p>
      <p class="text-[10px] text-white/30 text-center tracking-wider mt-2">
        {t.footer.designedBy} <a href="https://www.itdev.gr" target="_blank" rel="noopener" class="text-white/40 hover:text-white/60 transition-colors duration-300">IT DEV</a>
      </p>
    </div>
  </div>
</footer>

<script>
  document.getElementById('back-to-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
</script>
```

- [ ] **Step 2: Verify EN footer still renders correctly**

Reload `http://localhost:4321/` — footer should be unchanged visually (English copy, bilingual legal block).

- [ ] **Step 3: Commit**

```bash
git add src/components/global/Footer.astro
git commit -m "feat(i18n): footer reads from translation dictionary"
```

---

### Task 0.8: Phase 0 sanity verify

- [ ] **Step 1: Build the site to catch type errors**

Run: `npm run build`
Expected: Build completes. EN routes are emitted. EL pages will be absent (Phase 1 creates them).

- [ ] **Step 2: Browse the dev site**

Visit `http://localhost:4321/`. Confirm:
- Header shows EN/EL toggle (desktop) with EN underlined.
- Footer is unchanged visually, with bilingual legal block.
- Clicking EL goes to `/el/` and 404s (expected).

- [ ] **Step 3: No commit needed (verification only).**

Phase 0 is complete. Phase 1 parallel agents may now start.

---

## Phase 1 — Parallel page translations

Each task below is **independent**: it modifies only files it owns (one dict pair + one section component + thin shells). All Phase 1 agents may run in parallel.

**Conflict-prone shared file:** `src/i18n/index.ts`. Each Phase 1 task adds one line to this barrel. To avoid merge conflicts, agents append their export at the end of the file in a non-conflicting order; reviewer resolves any trivial conflict if two agents append simultaneously.

**Shell file template (used by every page mirror):**

EN shell (e.g. `src/pages/about.astro`):
```astro
---
import PageLayout from '../layouts/PageLayout.astro';
import AboutPage from '../components/pages/AboutPage.astro';
import { about as dict } from '../i18n';
import { useTranslations } from '../i18n/utils';
const lang = (Astro.currentLocale === 'el' ? 'el' : 'en') as 'en' | 'el';
const t = useTranslations(dict, lang);
---
<PageLayout
  title={t('meta.title')}
  description={t('meta.description')}
  transparentHeader={true}
>
  <AboutPage />
</PageLayout>
```

EL shell (`src/pages/el/about.astro`) — identical except `../` becomes `../../`:
```astro
---
import PageLayout from '../../layouts/PageLayout.astro';
import AboutPage from '../../components/pages/AboutPage.astro';
import { about as dict } from '../../i18n';
import { useTranslations } from '../../i18n/utils';
const lang = (Astro.currentLocale === 'el' ? 'el' : 'en') as 'en' | 'el';
const t = useTranslations(dict, lang);
---
<PageLayout
  title={t('meta.title')}
  description={t('meta.description')}
  transparentHeader={true}
>
  <AboutPage />
</PageLayout>
```

Inside the Section component (`src/components/pages/AboutPage.astro`), the component reads `Astro.currentLocale` directly and resolves strings the same way.

> **For each Phase 1 task:** the agent must (1) create both dict files filled with EN strings (copy from the original page) and Greek translations, (2) add a one-line export to `src/i18n/index.ts`, (3) create the Section component reading from `Astro.currentLocale`, (4) replace the existing EN page with the thin shell, (5) create the EL shell.

---

### Task 1.A: Home page

**Files:**
- Create: `src/i18n/en/home.ts`
- Create: `src/i18n/el/home.ts`
- Create: `src/components/pages/HomePage.astro`
- Modify: `src/pages/index.astro` (replace with shell)
- Create: `src/pages/el/index.astro` (shell)
- Modify: `src/i18n/index.ts` (add `home` export)
- Modify: home components (`Hero.astro`, `Visionary.astro`, `ServicesQuickView.astro`, `BridalLoungeTeaser.astro`, `InstagramFeed.astro`, `CTABanner.astro`) — refactor each to read from `home` dict

**Strings to translate** (verbatim copy from the original EN markup; Greek must match the Style Guide):

In `src/i18n/en/home.ts` export a default object with these keys:
- `meta.title` = `"Panos Antoniou Weddings Makeup and Hair | Bridal Beauty & Wedding Planning Santorini"`
- `meta.description` = (existing description on `src/pages/index.astro`)
- `hero.eyebrow` = `"Santorini · Greece · Worldwide"`
- `hero.name` = `"Panos Antoniou"`
- `hero.tagline` = `"The Mastery of Bridal Beauty & Wedding Design"`
- `hero.subtitle` = `"Crafting timeless elegance and bespoke wedding experiences in Santorini and beyond."`
- `hero.cta` = `"Check Availability"`
- `hero.scroll` = `"Scroll ↓"`
- `visionary.eyebrow` = `"The Visionary Behind the Brand"`
- `visionary.p1` = (full first paragraph from `Visionary.astro`)
- `visionary.p2` = (full second paragraph)
- `visionary.p2Link` = `"Bespoke Wedding Planning"`
- `visionary.p3` = (full third paragraph)
- `services.eyebrow` = `"Our Services"`
- `services.title` = `"A Complete Wedding Experience"`
- `services.bridalTitle` = `"Bridal Makeup & Hair"`
- `services.bridalDesc` = `"High-end beauty services signed by Panos Antoniou Wedding Makeup and Hair."`
- `services.bridalPrice` = `"Starting from €560"`
- `services.planningTitle` = `"Wedding Planning & Coordination"`
- `services.planningDesc` = `"From concept to execution, we design your wedding with precision and style."`
- `services.planningPrice` = `"Starting from €2,000"`
- `services.combinedTitle` = `"The Combined Experience"`
- `services.combinedDesc` = `"The ultimate fusion of beauty and organization for a flawless, stress-free result."`
- `services.combinedPrice` = `"Starting from €2,000"`
- `services.viewDetails` = `"View Details →"`
- `services.getInTouch` = `"Get in Touch →"`
- `bridalLounge.eyebrow` = `"Introducing — 2026"`
- `bridalLounge.title` = `"The Bridal Lounge & Makeup Studio"`
- `bridalLounge.location` = `"Pyrgos Village, Santorini"`
- `bridalLounge.subtitle` = `"A New Era in Bridal Preparation"`
- `bridalLounge.body` = `"A dedicated, high-end sanctuary designed exclusively for private bridal preparation and elite editorial photoshooting sessions."`
- `bridalLounge.cta` = `"Explore the Lounge"`
- `instagram.eyebrow` = `"@weddingsmakeupandhair"`
- `instagram.title` = `"Follow Our Journey"`
- `instagram.body` = `"See our latest work and behind-the-scenes moments on Instagram."`
- `instagram.cta` = `"Follow Us on Instagram →"`

In `src/i18n/el/home.ts`: same keys, Greek values (translate per Style Guide). Examples:
- `hero.eyebrow` = `"Σαντορίνη · Ελλάδα · Παγκοσμίως"`
- `hero.tagline` = `"Η Τέχνη της Νυφικής Ομορφιάς & του Σχεδιασμού Γάμου"`
- `hero.cta` = `"Δείτε Διαθεσιμότητα"`
- `services.title` = `"Μια Ολοκληρωμένη Εμπειρία Γάμου"`
- `services.bridalTitle` = `"Νυφικό Μακιγιάζ & Κόμμωση"`
- `services.bridalPrice` = `"Από €560"`
- `services.planningTitle` = `"Διοργάνωση & Συντονισμός Γάμου"`
- `services.planningPrice` = `"Από €2,000"`
- `services.combinedTitle` = `"The Combined Experience"` (keep as brand term) or `"Η Ολοκληρωμένη Εμπειρία"`
- etc.

- [ ] **Step 1: Create both dictionary files** with the full key set above (EN copy verbatim from source files; EL translated). Each value is a string.

- [ ] **Step 2: Append `home` to `src/i18n/index.ts`**

Add at the end of the file:
```ts
import enHome from './en/home';
import elHome from './el/home';
export const home = { en: enHome, el: elHome };
```

- [ ] **Step 3: Refactor `src/components/home/Hero.astro`** to read locale + dict:

```astro
---
import { isLocale, type Locale } from '../../i18n/utils';
import { home } from '../../i18n';
const lang: Locale = isLocale(Astro.currentLocale) ? Astro.currentLocale : 'en';
const t = home[lang];
---
<section class="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
  <img src="/images/hero/hero-santorini-sunset.jpg" alt="Luxury bridal makeup and hair Santorini Panos Antoniou" class="absolute inset-0 w-full h-full object-cover object-center" />
  <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60"></div>
  <div class="relative z-10 px-6 max-w-3xl" data-reveal>
    <p class="text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-white/60 mb-6">{t.hero.eyebrow}</p>
    <h1 class="font-serif text-display-xl font-light tracking-wide mb-5">{t.hero.name}</h1>
    <p class="font-serif text-xl md:text-2xl font-semibold italic text-white/85 mb-3">{t.hero.tagline}</p>
    <p class="text-sm font-medium text-white/60 max-w-lg mx-auto leading-relaxed mb-10">{t.hero.subtitle}</p>
    <a href={lang === 'el' ? '/el/contact' : '/contact'} class="inline-flex items-center justify-center px-9 py-4 bg-forest-green text-white text-xs font-sans font-medium tracking-[0.12em] uppercase hover:bg-green-light transition-all duration-300">
      {t.hero.cta}
    </a>
  </div>
  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-sans tracking-[0.15em] uppercase text-white/30 animate-bounce-slow">{t.hero.scroll}</div>
</section>
```

- [ ] **Step 4: Refactor `Visionary.astro`, `ServicesQuickView.astro`, `BridalLoungeTeaser.astro`, `InstagramFeed.astro`, `CTABanner.astro`** the same way (read `home[lang]`, replace strings, use `localizedPath('/contact', lang)` for hrefs, etc.).

For `ServicesQuickView.astro` specifically — the imports from `../../data/services` keep `image` and route paths, but title/description/price come from the dict:

```astro
---
import { isLocale, localizedPath, type Locale } from '../../i18n/utils';
import { home } from '../../i18n';
const lang: Locale = isLocale(Astro.currentLocale) ? Astro.currentLocale : 'en';
const t = home[lang];

const services = [
  {
    title: t.services.bridalTitle,
    description: t.services.bridalDesc,
    price: t.services.bridalPrice,
    image: '/images/services/bridal-closeup.jpg',
    href: localizedPath('/services/bridal-beauty', lang),
  },
  {
    title: t.services.planningTitle,
    description: t.services.planningDesc,
    price: t.services.planningPrice,
    image: '/images/services/ceremony-caldera.jpg',
    href: localizedPath('/services/wedding-planning', lang),
  },
];
---
<!-- (rest of the existing JSX, mapping over `services` instead of the imported data) -->
```

- [ ] **Step 5: Create `src/components/pages/HomePage.astro`**

Compose the six home components (it's essentially the body of the current `src/pages/index.astro`):

```astro
---
import Hero from '../home/Hero.astro';
import Visionary from '../home/Visionary.astro';
import BridalLoungeTeaser from '../home/BridalLoungeTeaser.astro';
import ServicesQuickView from '../home/ServicesQuickView.astro';
import InstagramFeed from '../home/InstagramFeed.astro';
import CTABanner from '../home/CTABanner.astro';
import { isLocale, localizedPath, type Locale } from '../../i18n/utils';
import { home } from '../../i18n';
const lang: Locale = isLocale(Astro.currentLocale) ? Astro.currentLocale : 'en';
const t = home[lang];
---
<Hero />
<Visionary />
<BridalLoungeTeaser />
<ServicesQuickView />
<InstagramFeed />
<CTABanner
  title={t.cta?.title ?? (lang === 'el' ? 'Ξεκινήστε την Εμπειρία' : 'Begin Your Experience')}
  buttonText={lang === 'el' ? 'Επικοινωνήστε' : 'Get in Touch'}
  buttonHref={localizedPath('/contact', lang)}
/>
```

(Note: the home page CTABanner did not previously exist in `index.astro` — verify the original; if it's not present, omit. Match the original layout exactly.)

- [ ] **Step 6: Replace `src/pages/index.astro` with the thin shell:**

```astro
---
import PageLayout from '../layouts/PageLayout.astro';
import HomePage from '../components/pages/HomePage.astro';
import { home } from '../i18n';
import { useTranslations } from '../i18n/utils';
const lang = (Astro.currentLocale === 'el' ? 'el' : 'en') as 'en' | 'el';
const t = useTranslations(home, lang);
---
<PageLayout title={t('meta.title')} description={t('meta.description')} transparentHeader={true}>
  <HomePage />
</PageLayout>
```

- [ ] **Step 7: Create `src/pages/el/index.astro`** with the same content but updated relative paths (`../../layouts/...`, `../../components/...`, `../../i18n`).

- [ ] **Step 8: Verify**

Visit `http://localhost:4321/` — EN home renders unchanged.
Visit `http://localhost:4321/el/` — EL home renders fully in Greek.
Toggle the EN/EL switcher in the header — URL switches between `/` and `/el/`.

- [ ] **Step 9: Commit**

```bash
git add src/i18n/ src/components/home/ src/components/pages/HomePage.astro src/pages/index.astro src/pages/el/index.astro
git commit -m "feat(i18n): translate home page (EN/EL)"
```

---

### Task 1.B: About page

**Files:**
- Create: `src/i18n/en/about.ts`, `src/i18n/el/about.ts`
- Modify: `src/i18n/index.ts` (add `about` export)
- Create: `src/components/pages/AboutPage.astro`
- Modify: `src/pages/about.astro` → thin shell
- Create: `src/pages/el/about.astro` → thin shell

**Strings to extract** (from current `src/pages/about.astro`):
- `meta.title`, `meta.description`
- `hero.title` = `"The Art of Bridal Perfection"`
- `hero.quote` = `'"Beauty is not created; it is revealed."'`
- `bio.heading` = `"The Visionary"`
- `bio.p1`, `bio.p2`, `bio.p3` (full paragraphs verbatim)
- `bio.linkMakeup` = `"makeup"` (anchor text)
- `bio.linkPlanning` = `"wedding planning"`
- `milestones.heading` = `"Career Milestones"`
- `milestones.items[].year`, `milestones.items[].title`, `milestones.items[].subtitle` — array of 5 (2001, 2004, 2008, 2010, 2026)
- `experience.heading` = `"Selected Experience"`
- `experience.items[]` — 6 strings ("Magazine Covers", etc.)
- `cta.title` = `"Discover Our Services"`
- `cta.buttonText` = `"View Services"`

Use `getEntry` helper from `src/i18n/utils.ts` for the array fields (`milestones.items`, `experience.items`).

- [ ] **Step 1: Create dict files** with all EN strings copied verbatim and Greek translations.
- [ ] **Step 2: Add `about` export to `src/i18n/index.ts`.**
- [ ] **Step 3: Create `src/components/pages/AboutPage.astro`** containing the section markup from the original `about.astro`, refactored to read from `about[lang]`. Replace every English string with a dict reference. Replace `/services/bridal-beauty` and `/services/wedding-planning` hrefs with `localizedPath(...)`.
- [ ] **Step 4: Replace `src/pages/about.astro`** with the thin shell (use the template at the top of Phase 1, with `transparentHeader={true}`).
- [ ] **Step 5: Create `src/pages/el/about.astro`** thin shell.
- [ ] **Step 6: Verify** `/about` and `/el/about` both render and the switcher swaps cleanly.
- [ ] **Step 7: Commit**: `feat(i18n): translate About page (EN/EL)`.

---

### Task 1.C: Services index page

**Files:**
- Create: `src/i18n/en/services-index.ts`, `src/i18n/el/services-index.ts`
- Modify: `src/i18n/index.ts` (add `servicesIndex` export)
- Create: `src/components/pages/ServicesIndexPage.astro`
- Modify: `src/pages/services/index.astro` → thin shell
- Create: `src/pages/el/services/index.astro` → thin shell

**Strings to extract:** every visible string in the current `src/pages/services/index.astro`. Keys to define (non-exhaustive — agent must cover ALL strings):
- `meta.title`, `meta.description`
- `hero.eyebrow` (none — use empty), `hero.title` = `"Our Services"`, `hero.subtitle` = `"Two pillars of your perfect wedding experience."`
- `cards.bridalBeauty.*`, `cards.weddingPlanning.*` (title, desc, price, cta = `"Learn More"`)
- `pricelist.eyebrow` = `"Complete Pricelist"`, `pricelist.title` = `"Download Our Brochure"`, `pricelist.body`, `pricelist.cta` = `"Download Pricelist (PDF)"`
- `detail.eyebrow` = `"Bridal Beauty"`, `detail.title` = `"Services in Detail"`
- `detail.fullBridal.*`, `detail.preNextDay.*`, `detail.partyEvent.*`, `detail.partyEvent.note`, `detail.doubleGlow.*`, `detail.groomed.*` (title, desc, price, cta)
- `combined.eyebrow` = `"The Complete Package"`, `combined.body`, `combined.cta`
- `cta.title` = `"Let's Create Something Beautiful"`, `cta.buttonText` = `"Book a Consultation"`

- [ ] **Step 1–7:** Same pattern as Task 1.B. Verify both `/services` and `/el/services`. Commit: `feat(i18n): translate Services index page (EN/EL)`.

---

### Task 1.D: Bridal Beauty service detail page

**Files:**
- Create: `src/i18n/en/bridal-beauty.ts`, `src/i18n/el/bridal-beauty.ts`
- Modify: `src/i18n/index.ts` (add `bridalBeauty` export)
- Create: `src/components/pages/BridalBeautyPage.astro`
- Modify: `src/pages/services/bridal-beauty.astro` → thin shell
- Create: `src/pages/el/services/bridal-beauty.astro` → thin shell

This page is the largest (350 lines). The agent must:
1. Read the full source of `src/pages/services/bridal-beauty.astro`.
2. Enumerate every English string visible to the user (headings, body, list items, prices in `<span>`s, button labels, ARIA labels).
3. Define dict keys covering all of them, grouped logically (`hero`, `intro`, `signature`, `signature.items[].name`, `packages`, `packages.items[]`, `bridesmaids`, `additional`, `sameSex`, `flowers`, `cta`, etc.).
4. Where the page reads from `src/data/services.ts` (`signatureServices`, `luxuryPackages`, `bridesmaidServices`, `additionalBridalServices`, `sameSexWeddingPackages`) — the **labels** must come from the dict and be looked up by the data item's `id`. Update `src/data/services.ts` if necessary to ensure every item has a stable `id`. (Prices stay in the data file.)
5. Use `getEntry` for any array-typed dict values.
6. Replace internal links via `localizedPath`.

- [ ] **Step 1–7:** Same pattern. Verify both routes. Commit: `feat(i18n): translate Bridal Beauty page (EN/EL)`.

---

### Task 1.E: Wedding Planning service detail page

**Files:**
- Create: `src/i18n/en/wedding-planning.ts`, `src/i18n/el/wedding-planning.ts`
- Modify: `src/i18n/index.ts` (add `weddingPlanning` export)
- Create: `src/components/pages/WeddingPlanningPage.astro`
- Modify: `src/pages/services/wedding-planning.astro` → thin shell
- Create: `src/pages/el/services/wedding-planning.astro` → thin shell

Same pattern as Task 1.D. Cover full-planning tiers, elopement packages, proposal packages, sailing experience — each name + each `includes` array item must be in the dict. Prices stay in `src/data/services.ts`.

- [ ] **Step 1–7:** Verify both routes. Commit: `feat(i18n): translate Wedding Planning page (EN/EL)`.

---

### Task 1.F: Bridal Lounge page

**Files:**
- Create: `src/i18n/en/bridal-lounge.ts`, `src/i18n/el/bridal-lounge.ts`
- Modify: `src/i18n/index.ts` (add `bridalLounge` export)
- Create: `src/components/pages/BridalLoungePage.astro`
- Modify: `src/pages/bridal-lounge.astro` → thin shell
- Create: `src/pages/el/bridal-lounge.astro` → thin shell

Translate hero, concept, "Volcanic Soul" section, three feature cards, boudoir section, studio services list (label per `studioServices` item — keep prices in data, names in dict by id), and CTA.

- [ ] **Step 1–7:** Verify. Commit: `feat(i18n): translate Bridal Lounge page (EN/EL)`.

---

### Task 1.G: Portfolio page

**Files:**
- Create: `src/i18n/en/portfolio.ts`, `src/i18n/el/portfolio.ts`
- Modify: `src/i18n/index.ts` (add `portfolio` export)
- Create: `src/components/pages/PortfolioPage.astro`
- Modify: `src/pages/portfolio.astro` → thin shell
- Create: `src/pages/el/portfolio.astro` → thin shell

The portfolio page consists mostly of image grids. The agent must:
1. Translate page chrome (hero title, intro copy, section headings, CTA).
2. For image captions: extend `src/data/portfolio.ts` so each item has a stable `id`, and store captions+alt under `portfolio.images.<id>.caption` / `.alt` in the dict. Reference by id from the section component.

- [ ] **Step 1–7:** Verify. Commit: `feat(i18n): translate Portfolio page (EN/EL)`.

---

### Task 1.H: Contact page

**Files:**
- Create: `src/i18n/en/contact.ts`, `src/i18n/el/contact.ts`
- Modify: `src/i18n/index.ts` (add `contact` export)
- Create: `src/components/pages/ContactPage.astro`
- Modify: `src/pages/contact.astro` → thin shell
- Create: `src/pages/el/contact.astro` → thin shell

Translate: hero, every form `label`, every `placeholder`, all `<option>` and `<optgroup>` labels, `datalist` options, submit button label, error message, success message + WhatsApp CTA, sidebar headings and contact-method labels ("Email", "WhatsApp / Mobile", "Office", "Location", "Follow Us"), location text.

The Firebase form submission script stays unchanged — only UI labels translate.

- [ ] **Step 1–7:** Verify. The form must still submit successfully from `/el/contact`. Commit: `feat(i18n): translate Contact page (EN/EL)`.

---

### Task 1.I: Booking Terms page

**Files:**
- Create: `src/i18n/en/booking-terms.ts`, `src/i18n/el/booking-terms.ts`
- Modify: `src/i18n/index.ts` (add `bookingTerms` export)
- Create: `src/components/pages/BookingTermsPage.astro`
- Modify: `src/pages/booking-terms.astro` → thin shell
- Create: `src/pages/el/booking-terms.astro` → thin shell

Translate: hero, intro paragraph, all 7 section headings ("Booking & Deposit", "Payment", "Payment Methods", "Cancellations", "Delays", "Travel Fees", "Team Assignment"), every list item inside each section (preserving `<strong>` emphasis spans — model this with a `parts: [{ text, strong }]` array or use inline HTML markers like `**...**` and render with `<Fragment set:html>`).

- [ ] **Step 1–7:** Verify. Commit: `feat(i18n): translate Booking Terms page (EN/EL)`.

---

### Task 1.J: Blog index + 3 posts

**Files:**
- Create: `src/i18n/en/blog.ts`, `src/i18n/el/blog.ts`
- Modify: `src/i18n/index.ts` (add `blog` export)
- Create: `src/components/pages/BlogIndexPage.astro`, `BlogWeddingBeauticianPage.astro`, `BlogBestWeddingMakeupServicesPage.astro`, `BlogSantoriniDreamWeddingPage.astro`
- Modify: `src/pages/blog/index.astro`, `src/pages/blog/wedding-beautician.astro`, `src/pages/blog/best-wedding-makeup-services.astro`, `src/pages/blog/santorini-dream-wedding.astro` → thin shells
- Create: `src/pages/el/blog/index.astro` + 3 post shells

Inside `blog.ts` dict, nest by post slug: `index.*`, `weddingBeautician.*`, `bestWeddingMakeupServices.*`, `santoriniDreamWedding.*`. Each post needs: `title`, `metaDescription`, `excerpt`, `date`, full `body` content (paragraphs as a string with line breaks rendered via `set:html` or split into `paragraphs: string[]`).

- [ ] **Step 1–7:** Verify the blog list and all 3 posts at `/blog/...` and `/el/blog/...`. Commit: `feat(i18n): translate blog index and 3 posts (EN/EL)`.

---

### Task 1.K: Data labels (services / testimonials)

**Files:**
- Create: `src/i18n/en/data.ts`, `src/i18n/el/data.ts`
- Modify: `src/i18n/index.ts` (add `data` export)
- Modify: `src/data/services.ts`, `src/data/testimonials.ts`

This task may be done after 1.D/1.E if the label-by-id work above is centralized here. If 1.D/1.E own their labels via their own dicts (recommended), this task only handles **testimonials** and any cross-cutting labels (e.g. "Group of 5 or more (per person)" if reused).

For testimonials: add an `id` to each entry in `src/data/testimonials.ts`, then in `data.ts` define `testimonials.<id>.quote` / `.name` / `.location` for both locales. Update any component that reads testimonials to resolve the labels by id.

- [ ] **Step 1–4:** Refactor data file, populate dicts, update consumer components. Verify on home or wherever testimonials surface. Commit: `feat(i18n): translate testimonials data (EN/EL)`.

---

## Phase 2 — QA, sitemap, final verification (sequential, single agent)

### Task 2.1: Build + smoke-test every route

- [ ] **Step 1: Build**

Run: `npm run build`
Expected: build completes with no errors. `dist/` contains both `dist/<route>/index.html` and `dist/el/<route>/index.html` for every page.

- [ ] **Step 2: Inventory expected routes**

EN: `/`, `/about`, `/services`, `/services/bridal-beauty`, `/services/wedding-planning`, `/bridal-lounge`, `/portfolio`, `/contact`, `/booking-terms`, `/blog`, `/blog/wedding-beautician`, `/blog/best-wedding-makeup-services`, `/blog/santorini-dream-wedding`.

EL: same list prefixed with `/el`.

Confirm `dist/el/...` exists for every EL route. If any is missing, the corresponding Phase 1 task did not run — re-dispatch.

- [ ] **Step 3: Preview server smoke test**

Run: `npm run preview`
Open every URL. For each: header EN/EL toggle correctly points to the other locale of the same page; copy is in the right language; no console errors; layout intact.

- [ ] **Step 4: Verify hreflang in HTML**

For at least 2 EN pages and 2 EL pages, view source and confirm both `<link rel="alternate" hreflang="en">` and `<link rel="alternate" hreflang="el">` are present and point to the correct counterpart.

### Task 2.2: Sitemap check

- [ ] **Step 1:** Inspect `dist/sitemap-index.xml` (or `dist/sitemap-0.xml`). Confirm EL routes are included and `xhtml:link` alternates are emitted (this is automatic when the sitemap integration's `i18n` block is set).

- [ ] **Step 2:** If sitemap is missing EL routes, audit `astro.config.mjs` `i18n` config and `sitemap` integration `i18n` config — they must match.

### Task 2.3: Manual visual regression

- [ ] **Step 1:** Side-by-side check `/` vs `/el/` at desktop and mobile breakpoints. Confirm:
  - Same imagery
  - Same layout
  - Header toggle reflects current locale (EN underlined on EN, EL underlined on EL)
  - Footer legal block shows BOTH Greek and English (bilingual always)
  - Contact form on `/el/contact` accepts and submits a test entry

- [ ] **Step 2:** Repeat for every other page pair.

- [ ] **Step 3:** Final commit only if any cleanup was needed:
```bash
git add -A
git commit -m "chore(i18n): final QA fixes"
```

### Task 2.4: Push

- [ ] **Step 1:**
```bash
git push
```

---

## Self-Review Checklist

Before declaring this plan complete, verify:

- [ ] Every page in the source (`src/pages/`) has a corresponding Phase 1 task (home, about, services index, bridal-beauty, wedding-planning, bridal-lounge, portfolio, contact, booking-terms, blog index, 3 blog posts).
- [ ] Every Phase 1 task names exact files it owns (no overlap with another task).
- [ ] The only shared file Phase 1 agents touch is `src/i18n/index.ts` — and only to append one line.
- [ ] Phase 0 produces a working EN site (verified in Task 0.8) before Phase 1 begins.
- [ ] LanguageSwitcher logic round-trips: `/about` → `/el/about` → `/about`.
- [ ] No task has a placeholder ("TBD", "translate later") — Greek translations are produced by the agent using the Style Guide.
- [ ] `astro.config.mjs` `i18n` config matches sitemap integration `i18n` config.
- [ ] Static build emits both locale trees.
- [ ] hreflang + canonical are correctly emitted by `BaseLayout`.
- [ ] Admin pages (`src/pages/admin/*`) are NOT translated (excluded by sitemap filter; English-only is fine).
