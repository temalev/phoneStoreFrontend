import { defineEventHandler, setResponseHeader } from 'h3';

type YandexCategory = {
  uuid: string;
  name: string;
};

type YandexProductVariantInfo = {
  price?: number;
  images?: string[];
};

type YandexProductVariant = {
  optionsInfo?: YandexProductVariantInfo;
};

type YandexProduct = {
  uuid: string;
  name: string;
  description?: string;
  price?: number;
  images?: string[];
  variants?: YandexProductVariant[];
  isDeleted?: boolean;
  categoryUUID?: string;
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

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiBase = config.public.URL;

  if (!apiBase) {
    setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8');
    return 'API URL is not configured';
  }

  const [products, categories] = await Promise.all([
    $fetch<YandexProduct[]>(`${apiBase}/api/v1/product`),
    $fetch<YandexCategory[]>(`${apiBase}/api/v1/category`),
  ]);

  const validProducts = (products || []).filter((p) => !p.isDeleted);

  const categoriesXml = (categories || [])
    .map(
      (c) =>
        `<category id="${escapeXml(c.uuid)}">${escapeXml(c.name)}</category>`,
    )
    .join('');

  const offersXml = validProducts
    .map((p) => {
      const basePrice =
        p.price ??
        p.variants?.[0]?.optionsInfo?.price ??
        0;

      const rawPicture =
        p.images?.[0] ??
        p.variants?.[0]?.optionsInfo?.images?.[0] ??
        '';

      const picture = rawPicture
        ? rawPicture.startsWith('http')
          ? rawPicture
          : `${SITE_URL}${rawPicture}`
        : '';

      const url = `${SITE_URL}/${p.uuid}`;

      return `<offer id="${escapeXml(p.uuid)}" available="true">
  <url>${escapeXml(url)}</url>
  <price>${escapeXml(basePrice)}</price>
  <currencyId>RUR</currencyId>
  ${
    p.categoryUUID
      ? `<categoryId>${escapeXml(p.categoryUUID)}</categoryId>`
      : ''
  }
  ${picture ? `<picture>${escapeXml(picture)}</picture>` : ''}
  <name>${escapeXml(p.name)}</name>
  <description>${escapeXml(p.description || '')}</description>
</offer>`;
    })
    .join('');

  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(
    now.getMonth() + 1,
  ).padStart(2, '0')}-${String(now.getDate()).padStart(
    2,
    '0',
  )} ${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes(),
  ).padStart(2, '0')}`;

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE yml_catalog SYSTEM "shops.dtd">
<yml_catalog date="${dateStr}">
  <shop>
    <name>РК Тек</name>
    <company>РК Тек</company>
    <url>${SITE_URL}</url>
    <currencies>
      <currency id="RUR" rate="1" />
    </currencies>
    <categories>
      ${categoriesXml}
    </categories>
    <offers>
      ${offersXml}
    </offers>
  </shop>
</yml_catalog>`;

  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8');
  return xml;
});

