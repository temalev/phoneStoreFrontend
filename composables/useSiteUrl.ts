/**
 * Единый источник правды для канонического URL сайта.
 * Используется в canonical, og:url, JSON-LD, sitemap и т.д.
 * Punycode-форма (ASCII) предпочтительнее кириллической для SEO-парсеров и аналитики.
 */
export const SITE_URL = 'https://xn----jtbnc0ao.xn--p1ai';

/**
 * Кириллический вариант — только для отображения пользователю (footer, contacts).
 * НЕ использовать в SEO-метатегах.
 */
export const SITE_URL_DISPLAY = 'https://рк-тек.рф';

export function useSiteUrl() {
  return { SITE_URL, SITE_URL_DISPLAY };
}
