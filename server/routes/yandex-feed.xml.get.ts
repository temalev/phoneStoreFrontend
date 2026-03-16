import { defineEventHandler, setResponseHeader } from 'h3';

type YandexCategory = {
  uuid: string;
  name: string;
  /** UUID родительской категории (для иерархии в фиде) */
  parentId?: string | null;
  parent_id?: string | null;
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
  slug?: string;
  description?: string;
  price?: number;
  images?: string[];
  variants?: YandexProductVariant[];
  isDeleted?: boolean;
  categoryUUID?: string;
};

const SITE_URL = 'https://рк-тек.рф';

/** Маппинг UUID категории → { id, url, name } для collections */
const CATEGORY_COLLECTIONS: Record<string, { id: string; url: string; name: string }> = {
  '49097885-2d30-4c88-bc26-eb7db2c6d841': { id: 'iphone', url: '/iphone', name: 'iPhone в интернет-магазине РК-Тек' },
  '50041b06-4eb0-45c8-8c87-bdf0049b4aa7': { id: 'ipad', url: '/ipad', name: 'iPad в интернет-магазине РК-Тек' },
  '548606d6-5836-4e0f-b93e-4e772ca22076': { id: 'mac', url: '/mac', name: 'Mac в интернет-магазине РК-Тек' },
  '4f3c7659-6cb4-4db9-93ec-a8975d681a20': { id: 'watch', url: '/watch', name: 'Apple Watch в интернет-магазине РК-Тек' },
  'c22124cd-f6f0-4e4a-b898-c1606f1c8e25': { id: 'airpods', url: '/airpods', name: 'AirPods в интернет-магазине РК-Тек' },
  '7342f370-a98b-485c-bcb9-41b6a1fd3318': { id: 'accessories', url: '/accessories', name: 'Аксессуары в интернет-магазине РК-Тек' },
  '3c28df49-c662-469e-90df-888724e24da1': { id: 'accessories-case', url: '/accessories/case', name: 'Аксессуары для iPhone в РК-Тек' },
  'baa43a78-850b-42c5-8487-e706e10292c5': { id: 'accessories-cable', url: '/accessories/cable', name: 'Адаптеры и кабели в РК-Тек' },
  '9c4fc64f-6545-4c8b-9745-e900e506082a': { id: 'accessories-mouse', url: '/accessories/mouse', name: 'Клавиатуры и мыши в РК-Тек' },
  'ccc52d81-7c9c-4619-87ff-6ed7e363fea2': { id: 'samsung', url: '/samsung', name: 'Samsung в интернет-магазине РК-Тек' },
  'b735980b-2c69-4450-bfac-69dd7ee60e44': { id: 'dyson', url: '/dyson', name: 'Dyson в интернет-магазине РК-Тек' },
  '12411ad6-f511-4812-b7a3-b3e41de95a64': { id: 'ps', url: '/ps', name: 'PlayStation 5 в интернет-магазине РК-Тек' },
  '8aeba603-a913-4577-903d-f7187c5e5abc': { id: 'other', url: '/other', name: 'Другое в интернет-магазине РК-Тек' },
  'c568e1fd-4206-422d-aa73-a8e448fe5690': { id: 'canon', url: '/canon', name: 'Canon в интернет-магазине РК-Тек' },
  'd53d2d22-5d38-4651-8da2-1076f06d6511': { id: 'whoop', url: '/whoop', name: 'Whoop в интернет-магазине РК-Тек' },
};

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

  const rawCategories = categories || [];

  // Иерархия: родители перед детьми (корни → дочерние → внуки)
  const getParentUuid = (c: YandexCategory): string | null =>
    c.parentId ?? c.parent_id ?? null;
  const byUuid = new Map(rawCategories.map((c) => [c.uuid, c]));
  const childrenByParent = new Map<string, YandexCategory[]>();
  rawCategories.forEach((c) => {
    const pu = getParentUuid(c);
    if (pu) {
      const list = childrenByParent.get(pu) ?? [];
      list.push(c);
      childrenByParent.set(pu, list);
    }
  });

  const sortedCategories: YandexCategory[] = [];
  const add = (list: YandexCategory[]) => {
    list.forEach((c) => {
      sortedCategories.push(c);
      const children = childrenByParent.get(c.uuid);
      if (children?.length) add(children);
    });
  };
  const roots = rawCategories.filter((c) => getParentUuid(c) === null);
  add(roots);
  // Категории без родителя в списке (битая ссылка) — дописываем в конец
  rawCategories.forEach((c) => {
    if (!sortedCategories.includes(c)) sortedCategories.push(c);
  });

  const uuidToNumericId = new Map<string, number>();
  sortedCategories.forEach((c, i) => {
    uuidToNumericId.set(c.uuid, i + 1);
  });

  const categoriesXml = sortedCategories
    .map((c, i) => {
      const numericId = i + 1;
      const parentUuid = getParentUuid(c);
      const parentNumericId =
        parentUuid != null ? uuidToNumericId.get(parentUuid) : undefined;
      const parentAttr =
        parentNumericId != null ? ` parentId="${parentNumericId}"` : '';
      return `<category id="${numericId}"${parentAttr}>${escapeXml(c.name)}</category>`;
    })
    .join('');

  const getCategoryNumericId = (p: YandexProduct): number | null => {
    if (p.categoryUUID) {
      const id = uuidToNumericId.get(p.categoryUUID);
      if (id != null) return id;
    }
    return null;
  };

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

      const url = `${SITE_URL}/${p.slug || p.uuid}`;
      const categoryId = getCategoryNumericId(p);

      const collection = p.categoryUUID ? CATEGORY_COLLECTIONS[p.categoryUUID] : null;

      return `<offer id="${escapeXml(p.uuid)}" available="true">
  <url>${escapeXml(url)}</url>
  <price>${escapeXml(basePrice)}</price>
  <currencyId>RUR</currencyId>
  ${categoryId != null ? `<categoryId>${categoryId}</categoryId>` : ''}
  ${picture ? `<picture>${escapeXml(picture)}</picture>` : ''}
  <name>${escapeXml(p.name)}</name>
  <description>${escapeXml(p.description || '')}</description>
  ${collection ? `<collectionId>${escapeXml(collection.id)}</collectionId>` : ''}
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

  const collectionsXml = Object.values(CATEGORY_COLLECTIONS)
    .map(
      (c) =>
        `<collection id="${escapeXml(c.id)}">
      <url>${escapeXml(SITE_URL + c.url)}</url>
      <name>${escapeXml(c.name)}</name>
    </collection>`,
    )
    .join('\n    ');

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
    <collections>
      ${collectionsXml}
    </collections>
  </shop>
</yml_catalog>`;

  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8');
  return xml;
});

