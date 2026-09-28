/**
 * Подборка «Другие модели» внизу карточки товара.
 *
 * Блок нужен прежде всего для перелинковки (SEO_PLAN, п. 2.3): робот
 * доходит до соседних карточек не только через категорию и футер,
 * а анкор каждой ссылки — название модели.
 *
 * Правила подборки:
 *   — только тот же раздел, что у текущего товара;
 *   — не больше RELATED_MODELS_LIMIT ссылок: длинная простыня размывает вес;
 *   — набор стабилен. Берём соседей текущего товара в порядке раздела
 *     (sortValue), по кругу: +1, −1, +2, −2… Случайная подборка на каждый
 *     рендер давала бы роботу при каждом обходе новую страницу, а «первые
 *     восемь раздела» вели бы все ссылки на одни и те же карточки, оставив
 *     хвост раздела без входящих. Кольцо соседей даёт входящие ссылки каждой
 *     карточке, и соседи по сортировке обычно и есть ближайшие модели
 *     (16 Pro рядом с 16 Pro Max).
 *
 * Типы в JSDoc, а не аннотациями — как в соседних useProductPrice.ts и useSeoText.ts.
 */
import { productPrices } from './useProductPrice.ts';

export const RELATED_MODELS_LIMIT = 8;

/**
 * Лёгкая запись для блока: в payload страницы уходит только она,
 * а не товары раздела целиком со всеми вариантами и картинками.
 * @param {object} product товар из API
 * @returns {{ uuid: string, to: string, name: string, image: string,
 *   price: number, isFrom: boolean }}
 */
const toRelatedItem = (product) => {
  const prices = productPrices(product);
  const min = prices[0] ?? 0;
  const max = prices[prices.length - 1] ?? 0;
  return {
    uuid: product.uuid,
    to: `/${product.slug || product.uuid}`,
    name: product.name,
    // Та же картинка, что у товара на странице раздела (components/cardProduct).
    image: product.variants?.[0]?.optionsInfo?.images?.[0] || product.images?.[0] || '',
    price: min,
    isFrom: max > min,
  };
};

/**
 * Соседи текущего товара в разделе.
 * @param {object[]|null} products товары раздела из API, в порядке раздела
 * @param {string} currentUuid uuid текущего товара
 * @param {number} [limit]
 * @returns {ReturnType<typeof toRelatedItem>[]}
 */
export function relatedModels(products, currentUuid, limit = RELATED_MODELS_LIMIT) {
  const list = (Array.isArray(products) ? products : [])
    .filter((p) => p?.uuid && p.name && !p.isDeleted && p.visible !== false);

  const others = list.filter((p) => p.uuid !== currentUuid);
  if (others.length <= limit) return others.map(toRelatedItem);

  const idx = list.findIndex((p) => p.uuid === currentUuid);
  // Товара нет в выдаче раздела (скрыт или вне первой страницы API) —
  // соседей нет, берём начало раздела.
  if (idx === -1) return others.slice(0, limit).map(toRelatedItem);

  const n = list.length;
  const picked = new Set();
  for (let step = 1; picked.size < limit && step < n; step += 1) {
    picked.add((idx + step) % n);
    if (picked.size < limit) picked.add((idx - step + n) % n);
  }
  picked.delete(idx);

  // На странице — в порядке раздела, а не в порядке обхода.
  return [...picked].sort((a, b) => a - b).map((i) => toRelatedItem(list[i]));
}
