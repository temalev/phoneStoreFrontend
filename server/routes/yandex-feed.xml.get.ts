import { defineEventHandler, setResponseHeader } from 'h3';
import { productOffers } from '../../composables/useProductOffers';
import { productBrand, hasWord } from '../../composables/useProductBrand';

type YandexCategory = {
  uuid: string;
  name: string;
  /** UUID родительской категории (для иерархии в фиде) */
  parentId?: string | null;
  parent_id?: string | null;
};

type YandexOptionItem = {
  id: number | string;
  name?: string;
  value?: string;
};

type YandexOption = {
  name: string;
  items?: YandexOptionItem[];
};

type YandexProductVariantInfo = {
  price?: number;
  oldPrice?: number;
  images?: string[];
};

type YandexProductVariant = {
  id?: number;
  optionsIds?: (number | string)[];
  optionsInfo?: YandexProductVariantInfo;
};

type YandexProduct = {
  uuid: string;
  name: string;
  slug?: string;
  description?: string;
  price?: number;
  priceOld?: number;
  images?: string[];
  options?: YandexOption[];
  variants?: YandexProductVariant[];
  isDeleted?: boolean;
  categoryUUID?: string;
};

const SITE_URL = 'https://xn----jtbnc0ao.xn--p1ai';

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

/**
 * Название предложения Яндекс просит собирать по схеме
 * «тип + бренд + модель + параметры»: объединённая карточка в Поиске —
 * это конкретная модификация, и название должно отличать её от соседних.
 * Пример из их справки: «Смартфон Apple iPhone 14 Pro 256 ГБ RU, …, космический черный».
 *
 * Тип дописывается, только если название начинается не с русского слова:
 * у «Стайлер Dyson…» и «Кабель Apple…» он уже есть.
 */
const PRODUCT_TYPES: [RegExp, string][] = [
  [/MacBook/i, 'Ноутбук'],
  [/iPad/i, 'Планшет'],
  [/\bi?Phone\b|Galaxy [SZA]/i, 'Смартфон'],
  [/Watch/i, 'Умные часы'],
  [/AirPods/i, 'Наушники'],
  [/DualSense/i, 'Геймпад'],
  [/PlayStation/i, 'Игровая приставка'],
];

const startsWithCyrillic = (text: string) => /^[А-ЯЁа-яё]/.test(text);

/** Бренд в название, если его там нет: после русского типа или в начало. */
const withBrand = (name: string, brand: string | null): string => {
  if (!brand || hasWord(name, brand)) return name;
  if (!startsWithCyrillic(name)) return `${brand} ${name}`;
  // «Кабель USB-C — Lightning» → «Кабель Apple USB-C — Lightning»
  const typed = name.match(/^((?:[А-ЯЁа-яё-]+\s+)+)([^А-ЯЁа-яё].*)$/);
  return typed ? `${typed[1]}${brand} ${typed[2]}` : name;
};

const withType = (name: string): string => {
  if (startsWithCyrillic(name)) return name;
  const type = PRODUCT_TYPES.find(([pattern]) => pattern.test(name))?.[1];
  return type ? `${type} ${name}` : name;
};

/** Подписи опций в названии там, где голое значение непонятно. */
const OPTION_LABELS: Record<string, string> = {
  'цвет ремешка': 'ремешок',
  'цвет корпуса': 'корпус',
  'зарядный кейс': 'кейс',
};

/** Имена характеристик в `<param>`: в админке они заведены вразнобой. */
const PARAM_NAMES: Record<string, string> = {
  sim: 'SIM',
  'объем памяти': 'Объём памяти',
  'возможность подключения': 'Подключение',
};

const isRam = (optionName: string) => /оперативн/i.test(optionName);
const isStorage = (optionName: string) => /ssd|накопит|объ[её]м памяти/i.test(optionName);
const isHexColor = (value: string) => /^#[0-9a-f]{3,8}$/i.test(value);

type VariantOption = { name: string; value: string };

/** Выбранные в варианте пункты опций по порядку опций товара. */
const variantOptions = (p: YandexProduct, v: YandexProductVariant | null): VariantOption[] => {
  if (!v) return [];
  const ids = new Set((v.optionsIds ?? []).map(String));
  return (p.options ?? []).flatMap((option) => {
    const item = option.items?.find((i) => ids.has(String(i.id)));
    const value = String(item?.name ?? item?.value ?? '').trim();
    return value && !isHexColor(value) ? [{ name: option.name.trim(), value }] : [];
  });
};

const buildOfferName = (p: YandexProduct, options: VariantOption[]): string => {
  const base = withType(withBrand((p.name || '').replace(/\s+/g, ' ').trim(), productBrand(p)));
  const hasRam = options.some((o) => isRam(o.name));

  const parts = options
    // «iPhone Air (eSim)» уже говорит про eSIM, «…(Nickel/Gold)» — про цвет
    .filter((o) => !base.toLowerCase().includes(o.value.toLowerCase()))
    .map((o) => {
      if (hasRam && isRam(o.name)) return `${o.value} RAM`;
      if (hasRam && isStorage(o.name)) return `${o.value} SSD`;
      // «Белый» → «белый», «С шумоподавлением» → «с шумоподавлением»
      const value = o.value.replace(/^[А-ЯЁ](?=[а-яё\s])/, (c) => c.toLowerCase());
      const label = OPTION_LABELS[o.name.toLowerCase()];
      return label ? `${label} ${value}` : value;
    });

  if (!parts.length) return base;
  return `${base}${base.includes(',') ? ', ' : ' '}${parts.join(', ')}`;
};

const paramName = (optionName: string): string =>
  PARAM_NAMES[optionName.toLowerCase()]
  ?? optionName.charAt(0).toUpperCase() + optionName.slice(1);

/**
 * В описании Яндекс запрещает рекламу, регион, условия продажи и контакты.
 * В админке же туда пишутся заметки для покупателя на сайте: «5 подарков
 * при покупке», «уточняйте в аккаунте поддержки», «модель снята
 * с производства» — на сайте они уместны, в фиде это ошибки. Такие
 * предложения из описания для фида вырезаются, остальное остаётся как есть.
 */
const SHOP_NOTE = /подар|уточн|снят[аы]? с производства|другие (конфигурации|модели|цвета)|по запросу|заказ|в наличии|стоимост|дешевле|скидк|акци|бесплатн|рязан|москв|доставк|\*/i;

const cleanDescription = (raw: string | undefined): string =>
  (raw || '')
    .split(/\n+/)
    .flatMap((line) => line.split(/(?<=[.!?…])\s+/))
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence && !SHOP_NOTE.test(sentence))
    .join(' ');

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  // Роут всегда серверный: берём внутренний адрес бэкенда, если он задан.
  // Хвостовой слэш из NUXT_PUBLIC_URL срезаем, иначе получается двойной.
  const apiBase = String(config.apiInternal || config.public.URL || '').replace(/\/+$/, '');

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

  const absoluteUrl = (src: string) => (src.startsWith('http') ? src : `${SITE_URL}${src}`);

  /**
   * По предложению на каждый вариант с ценой — см. useProductOffers.ts.
   * Вариант без положительной цены («цена по запросу») в фид не попадает:
   * `<price>` обязателен и должен быть больше нуля, ноль — ежедневная
   * ошибка в Мерчантах.
   */
  const offersXml = validProducts
    .flatMap((p) => {
      const slug = p.slug || p.uuid;
      const categoryId = getCategoryNumericId(p);
      const collection = p.categoryUUID ? CATEGORY_COLLECTIONS[p.categoryUUID] : null;
      const brand = productBrand(p);
      const productDescription = cleanDescription(p.description);

      return productOffers(p).map((offer) => {
        const options = variantOptions(p, offer.variant);
        const name = buildOfferName(p, options);

        const pictures = (offer.images.length ? offer.images : p.images ?? [])
          .filter(Boolean)
          .slice(0, 20)
          .map(absoluteUrl);

        // Адрес открывает карточку ровно с этим вариантом: одинаковый URL
        // у разных предложений Яндекс считает дублем и показывает только первое.
        const url = offer.key
          ? `${SITE_URL}/${slug}?v=${offer.key}`
          : `${SITE_URL}/${slug}`;

        // Старую цену Яндекс принимает при скидке от 5 до 75%. У большинства
        // вариантов в API oldPrice ниже новой цены — это не скидка.
        const discount = offer.oldPrice > offer.price ? 1 - offer.price / offer.oldPrice : 0;
        const oldPrice = discount >= 0.05 && discount <= 0.75 ? offer.oldPrice : 0;

        // Описание обязательно. Пока своего текста нет, лучше повторить
        // название, чем писать туда условия продажи.
        const description = productDescription.length >= 30 ? productDescription : `${name}.`;

        return `<offer id="${escapeXml(offer.id)}" available="true">
  <url>${escapeXml(url)}</url>
  <price>${offer.price}</price>
  ${oldPrice ? `<oldprice>${oldPrice}</oldprice>` : ''}
  <currencyId>RUR</currencyId>
  ${categoryId != null ? `<categoryId>${categoryId}</categoryId>` : ''}
  ${pictures.map((src) => `<picture>${escapeXml(src)}</picture>`).join('\n  ')}
  <name>${escapeXml(name)}</name>
  ${brand ? `<vendor>${escapeXml(brand)}</vendor>` : ''}
  <description>${escapeXml(description)}</description>
  ${options.map((o) => `<param name="${escapeXml(paramName(o.name))}">${escapeXml(o.value)}</param>`).join('\n  ')}
  ${collection ? `<collectionId>${escapeXml(collection.id)}</collectionId>` : ''}
</offer>`;
      });
    })
    .join('');

  // RFC 3339 с часовым поясом — так требует справка Яндекс Товаров.
  const dateStr = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

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

