import { defineEventHandler, setResponseHeader } from 'h3';

type SitemapProduct = {
  uuid: string;
  slug?: string;
  isDeleted?: boolean;
  updatedAt?: string;
};

const SITE_URL = 'https://xn----jtbnc0ao.xn--p1ai';

/**
 * Последняя успешно собранная карта — чтобы при отказе API не отдавать
 * урезанную. Живёт в памяти процесса: переживает сбой бэкенда, но не рестарт
 * контейнера. Этого достаточно — защищаемся мы от коротких отказов API,
 * а не от холодного старта.
 *
 * Зачем вообще: раньше при упавшем API карта молча худела со 109 адресов до 32
 * статических и отдавалась с кодом 200. Робот получал валидный документ,
 * в котором товары просто исчезли, и делал единственно возможный вывод —
 * их удалили с сайта. Пустой sitemap хуже ошибки: это активный сигнал
 * к деиндексации, тогда как отсутствующий sitemap — не сигнал вообще.
 */
let lastGoodXml: string | null = null;
let lastGoodAt = 0;

/**
 * Дольше суток отдавать сохранённую карту не будем: за это время успевают
 * появиться и исчезнуть товары, и вчерашний список начнёт врать про 404.
 * После суток честнее ответить 503 и позвать робота позже.
 */
const STALE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

const escapeXml = (unsafe: unknown): string => {
  if (unsafe === null || unsafe === undefined) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

/** Из ISO или даты — в YYYY-MM-DD для lastmod (статичные страницы) */
function toLastmod(value: string | undefined, fallback: string): string {
  if (!value) return fallback;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return fallback;
  return d.toISOString().slice(0, 10);
}

/** Для товаров: lastmod со временем (полный ISO) */
function toProductLastmod(value: string | undefined, fallback: string): string {
  if (!value) return fallback;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return fallback;
  return d.toISOString();
}

/** Статические URL: главная, категории, контакты, блог (как в бывшем public/sitemap.xml) */
function getStaticUrlEntries(now: string): string {
  const entries: Array<{ loc: string; changefreq: string; priority: string }> = [
    { loc: '/', changefreq: 'daily', priority: '1.0' },
    { loc: '/iphone', changefreq: 'daily', priority: '0.9' },
    { loc: '/ipad', changefreq: 'daily', priority: '0.8' },
    { loc: '/mac', changefreq: 'daily', priority: '0.8' },
    { loc: '/watch', changefreq: 'daily', priority: '0.8' },
    { loc: '/airpods', changefreq: 'daily', priority: '0.8' },
    { loc: '/samsung', changefreq: 'daily', priority: '0.7' },
    { loc: '/dyson', changefreq: 'daily', priority: '0.7' },
    { loc: '/ps', changefreq: 'daily', priority: '0.7' },
    { loc: '/canon', changefreq: 'daily', priority: '0.7' },
    { loc: '/whoop', changefreq: 'daily', priority: '0.7' },
    { loc: '/accessories', changefreq: 'daily', priority: '0.8' },
    { loc: '/accessories/case', changefreq: 'daily', priority: '0.7' },
    { loc: '/accessories/cable', changefreq: 'daily', priority: '0.7' },
    { loc: '/accessories/mouse', changefreq: 'daily', priority: '0.7' },
    { loc: '/other', changefreq: 'monthly', priority: '0.6' },
    { loc: '/other/marshall', changefreq: 'monthly', priority: '0.5' },
    { loc: '/other/dji', changefreq: 'monthly', priority: '0.5' },
    { loc: '/other/xiaomi', changefreq: 'monthly', priority: '0.5' },
    { loc: '/other/jbl', changefreq: 'monthly', priority: '0.5' },
    { loc: '/other/dreame', changefreq: 'monthly', priority: '0.5' },
    { loc: '/contacts', changefreq: 'monthly', priority: '0.7' },
    { loc: '/blog', changefreq: 'daily', priority: '0.8' },
    { loc: '/blog/esim-v-iphone-kak-perenesti-nomer', changefreq: 'monthly', priority: '0.7' },
    { loc: '/blog/iphone-18-sluhi-2026', changefreq: 'weekly', priority: '0.7' },
    { loc: '/blog/iphone-17e-obzor-2026', changefreq: 'monthly', priority: '0.7' },
    { loc: '/blog/kakoy-macbook-vybrat-v-2026', changefreq: 'monthly', priority: '0.7' },
    { loc: '/blog/apple-quartz-watch-1995', changefreq: 'monthly', priority: '0.6' },
    { loc: '/blog/pervyy-iphone-fakty', changefreq: 'monthly', priority: '0.6' },
    { loc: '/blog/rezhim-modema-iphone-nastroyka', changefreq: 'monthly', priority: '0.6' },
    { loc: '/blog/hard-reset-iphone-ipad', changefreq: 'monthly', priority: '0.6' },
    { loc: '/blog/kak-perenet-dannye-na-novyi-iphone', changefreq: 'monthly', priority: '0.6' },
    { loc: '/blog/mozhno-li-plavat-s-iphone', changefreq: 'monthly', priority: '0.6' },
  ];
  return entries
    .map(
      (e) =>
        `  <url>
    <loc>${escapeXml(SITE_URL + e.loc)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`,
    )
    .join('\n');
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiBase = config.public.URL;

  const now = new Date()
    .toISOString()
    .slice(0, 10);
  const nowFull = new Date().toISOString();

  let productsXml = '';
  // Товары — обязательная часть карты. Не собрали их — карта неполная,
  // и отдавать её как полную нельзя.
  let productsFailed = false;

  if (!apiBase) {
    // Пустой apiBase — конфигурационная поломка, а не «сайт без товаров».
    productsFailed = true;
    // eslint-disable-next-line no-console
    console.error('[sitemap] apiBase пуст — карту товаров собрать нечем');
  } else {
    try {
      const products = await $fetch<SitemapProduct[]>(`${apiBase}/api/v1/product`);
      const valid = (products || []).filter((p) => !p.isDeleted);

      // Пустой список — тот же провал, только тихий: полуживой бэкенд отвечает
      // 200 и пустым массивом, и карта опять схлопывается до статики с кодом 200.
      // У работающего магазина товаров не ноль, так что это всегда поломка.
      if (valid.length === 0) {
        throw new Error('API вернул пустой список товаров');
      }

      productsXml = valid
        .map((p) => {
          const lastmod = toProductLastmod(p.updatedAt, nowFull);
          return `  <url>
    <loc>${escapeXml(`${SITE_URL}/${p.slug || p.uuid}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>`;
        })
        .join('\n');
    } catch (e) {
      productsFailed = true;
      // eslint-disable-next-line no-console
      console.error('[sitemap] не удалось получить товары:', e);
    }
  }

  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8');

  if (productsFailed) {
    const age = Date.now() - lastGoodAt;

    if (lastGoodXml && age < STALE_MAX_AGE_MS) {
      // Отдаём последнюю удачную карту. Она чуть устарела, но это честный
      // список существующих адресов, а не сообщение «товары удалены».
      setResponseHeader(event, 'X-Sitemap-Cache', `stale;age=${Math.round(age / 1000)}s`);
      return lastGoodXml;
    }

    // Показать нечего: процесс только поднялся и ни разу не собрал карту,
    // либо сохранённая протухла. 503 + Retry-After — «зайди позже»,
    // индекс при этом не трогается.
    event.node.res.statusCode = 503;
    setResponseHeader(event, 'Retry-After', '600');
    return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Карта сайта временно недоступна: не удалось получить список товаров. -->
`;
  }

  const staticXml = getStaticUrlEntries(now);
  const urlset = `${staticXml}\n\n  <!-- Товары -->\n${productsXml}`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${urlset}

</urlset>
`;

  lastGoodXml = xml;
  lastGoodAt = Date.now();

  return xml;
});
