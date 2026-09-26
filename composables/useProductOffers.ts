/**
 * Предложения товара — по одному на каждый вариант с ценой.
 *
 * Общие для фида Яндекс Товаров и разметки `Product` на карточке. У каждого
 * предложения свой адрес `/<slug>?v=<ключ>`, и карточка по нему открывается
 * ровно с этим вариантом. Яндекс сверяет цену в фиде с ценой на странице,
 * а раньше в фиде было одно предложение на товар с минимальной ценой,
 * тогда как страница показывала вариант по умолчанию: цены расходились
 * у 13 товаров из 58, у трёх страница вместо цены предлагала её уточнить.
 *
 * Ключ варианта строится из его опций, а не из id: в API одни и те же id
 * встречаются у разных товаров и даже внутри одного (Galaxy S25, Apple Pencil),
 * а у части вариантов id нет вовсе. Набор опций внутри товара уникален всегда.
 *
 * Типы в JSDoc, а не аннотациями — как в соседнем useProductPrice.ts.
 */

/**
 * Положительная цена или 0. Ноль в API — «цена по запросу», а не цена.
 * @param {unknown} value
 * @returns {number}
 */
const toPrice = (value) => {
  const price = Number(value);
  return Number.isFinite(price) && price > 0 ? price : 0;
};

/**
 * FNV-1a, 32 бита: короткий стабильный хеш без зависимостей,
 * одинаковый на сервере и в браузере.
 * @param {string} str
 * @returns {string}
 */
const hash = (str) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  // eslint-disable-next-line no-bitwise
  return (h >>> 0).toString(36);
};

/**
 * Ключ варианта для адреса `?v=` — хеш отсортированных id его опций.
 * @param {object} variant вариант товара из API
 * @returns {string}
 */
export function variantKey(variant) {
  const ids = (variant?.optionsIds ?? []).map(String).sort();
  return hash(ids.join(','));
}

/**
 * Идентификатор предложения: `<id>` в фиде и `sku` в разметке.
 * Яндекс ограничивает его 20 символами — отсюда 8 знаков от uuid товара
 * и ключ варианта (до 7 знаков), а не uuid целиком.
 * @param {object} product товар из API
 * @param {string|null} key ключ варианта или null для товара без вариантов
 * @returns {string}
 */
export function offerId(product, key) {
  const base = String(product?.uuid ?? '').replace(/-/g, '').slice(0, 8);
  return key ? `${base}-${key}` : base;
}

/**
 * Все предложения товара: по одному на вариант с положительной ценой.
 * Если таких вариантов нет, единственное предложение — базовая цена товара.
 * Пустой массив — «цена по запросу».
 * @param {object} product товар из API
 * @returns {{ id: string, key: string|null, variant: object|null,
 *   price: number, oldPrice: number, images: string[] }[]}
 */
export function productOffers(product) {
  if (!product) return [];

  const priced = (product.variants ?? [])
    .map((variant) => ({ variant, price: toPrice(variant?.optionsInfo?.price) }))
    .filter(({ price }) => price > 0);

  if (priced.length) {
    return priced.map(({ variant, price }) => {
      const key = variantKey(variant);
      return {
        id: offerId(product, key),
        key,
        variant,
        price,
        oldPrice: toPrice(variant.optionsInfo?.oldPrice),
        images: variant.optionsInfo?.images ?? [],
      };
    });
  }

  const price = toPrice(product.price);
  if (!price) return [];

  // Картинка в том же порядке, что на карточке: вариант по умолчанию,
  // первый вариант, общие фото товара. У MacBook Pro 16" общих фото нет вовсе.
  const defaultVariant = product.variants?.find((v) => v.isDefault);
  const images = [
    defaultVariant?.optionsInfo?.images,
    product.variants?.[0]?.optionsInfo?.images,
    product.images,
  ].find((list) => list?.length) ?? [];

  return [{
    id: offerId(product, null),
    key: null,
    variant: null,
    price,
    oldPrice: toPrice(product.priceOld),
    images,
  }];
}
