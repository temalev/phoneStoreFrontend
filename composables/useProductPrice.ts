/**
 * Цена товара — одно место на весь проект.
 *
 * Правило простое: цена есть только тогда, когда она положительная.
 * Ноль в API означает «цена по запросу», а не «стоит нисколько», и раньше
 * каждый потребитель трактовал его по-своему:
 *   — карточка делала `Math.min()` на пустом массиве и печатала «∞ ₽» в title;
 *   — разметка `Product` отдавала `price: 0` у 42 товаров из 75;
 *   — фид Я.Товаров брал `p.price ?? variants[0].price`, и `??` пропускал
 *     нулевой `p.price` вперёд настоящих цен вариантов — 54 нулевых оффера.
 * Три разных неверных ответа на один вопрос, поэтому ответ теперь один.
 *
 * Типы в JSDoc, а не аннотациями: eslint проекта без TS-парсера,
 * соседние useSiteUrl.ts и useSeoText.ts написаны так же.
 */

/**
 * Все реальные цены товара по возрастанию.
 * Варианты приоритетнее базовой цены; если положительных цен у вариантов нет,
 * в дело идёт базовая. Пустой массив — «цена по запросу».
 * @param {object} product товар из API
 * @returns {number[]}
 */
export function productPrices(product) {
  if (!product) return [];

  const variantPrices = (product.variants ?? [])
    .map((v) => Number(v?.optionsInfo?.price))
    .filter((p) => Number.isFinite(p) && p > 0);

  if (variantPrices.length) return variantPrices.sort((a, b) => a - b);

  const base = Number(product.price);
  return Number.isFinite(base) && base > 0 ? [base] : [];
}

/**
 * Минимальная цена товара или 0, если цены нет.
 * Ноль здесь — сигнал «не показывать цену», а не сама цена.
 * @param {object} product товар из API
 * @returns {number}
 */
export function minProductPrice(product) {
  return productPrices(product)[0] ?? 0;
}
