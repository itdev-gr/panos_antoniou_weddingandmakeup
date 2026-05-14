export const LOCALES = ['en', 'el'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(value: string | undefined | null): value is Locale {
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
 *   const lang = (Astro.currentLocale === 'el' ? 'el' : 'en') as 'en' | 'el';
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

export function currentLocale(astroLocale: string | undefined): Locale {
  return isLocale(astroLocale) ? astroLocale : DEFAULT_LOCALE;
}
