import { defineEventHandler, setResponseHeader } from 'h3';

type SitemapProduct = {
  uuid: string;
  slug?: string;
  isDeleted?: boolean;
  updatedAt?: string;
};

const SITE_URL = 'https://рк-тек.рф';

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
  if (apiBase) {
    try {
      const products = await $fetch<SitemapProduct[]>(`${apiBase}/api/v1/product`);
      const valid = (products || []).filter((p) => !p.isDeleted);
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
    } catch {
      // без товаров отдаём только статику
    }
  }

  const staticXml = getStaticUrlEntries(now);
  const urlset =
    staticXml + (productsXml ? '\n\n  <!-- Товары -->\n' + productsXml : '');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${urlset}

</urlset>
`;

  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8');
  return xml;
});
