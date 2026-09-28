/**
 * Характеристики товара: [{ title: 'Дисплей', items: [{ name: 'Диагональ', value: '6,3 дюйма' }] }].
 *
 * Хранятся таблицей, а не HTML, чтобы одни и те же строки шли в три места:
 * таблицу на карточке, `<param>` фида Яндекс Товаров и `additionalProperty`
 * разметки Product. Бэкенд нормализует структуру при сохранении; здесь —
 * страховка для ответов API без поля и для черновика в админке.
 *
 * Типы в JSDoc, а не аннотациями — как в соседних useProductPrice.ts и useSeoText.ts.
 */

/** @typedef {{ name: string, value: string }} SpecItem */
/** @typedef {{ title: string, items: SpecItem[] }} SpecGroup */

const clean = (value) => (typeof value === 'string' || typeof value === 'number'
  ? String(value).trim()
  : '');

/**
 * @param {unknown} raw
 * @returns {SpecGroup[]}
 */
export function normalizeSpecs(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((group) => ({
      title: clean(group?.title),
      items: (Array.isArray(group?.items) ? group.items : [])
        .map((item) => ({ name: clean(item?.name), value: clean(item?.value) }))
        .filter((item) => item.name && item.value),
    }))
    .filter((group) => group.items.length);
}

/**
 * @param {{ specs?: unknown } | null | undefined} product
 * @returns {SpecGroup[]}
 */
export const productSpecs = (product) => normalizeSpecs(product?.specs);

// «Технология» или «Разрешение» без группы непонятны — в плоском списке имя
// строки уточняется группой: «Дисплей: разрешение». Аббревиатуры не трогаем.
const flatName = (group, item) => {
  if (!group.title) return item.name;
  const name = /^[А-ЯЁ][а-яё]/.test(item.name)
    ? item.name.charAt(0).toLowerCase() + item.name.slice(1)
    : item.name;
  return `${group.title}: ${name}`;
};

/**
 * Характеристики одним списком — для `<param>` фида и `additionalProperty`.
 * @param {{ specs?: unknown } | null | undefined} product
 * @returns {SpecItem[]}
 */
export function specProperties(product) {
  const seen = new Set();
  return productSpecs(product)
    .flatMap((group) => group.items.map((item) => ({ name: flatName(group, item), value: item.value })))
    .filter((prop) => {
      const key = prop.name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

/**
 * Разбор вставленного текста в группы — для кнопки «Вставить списком» в админке.
 * Строка «Название: значение» или «Название<Tab>значение» — строка таблицы
 * (так копируются таблицы с сайтов производителей), строка без разделителя —
 * заголовок новой группы.
 * @param {string} text
 * @returns {SpecGroup[]}
 */
export function parseSpecsText(text) {
  const groups = [];
  let current = null;
  String(text || '').split(/\r?\n/).forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) return;
    const match = line.match(/^([^\t:]+?)\s*(?:\t+|:\s+)(.+)$/);
    if (!match) {
      current = { title: line.replace(/:$/, ''), items: [] };
      groups.push(current);
      return;
    }
    if (!current) {
      current = { title: '', items: [] };
      groups.push(current);
    }
    current.items.push({ name: match[1].trim(), value: match[2].replace(/\t+/g, ', ').trim() });
  });
  return normalizeSpecs(groups);
}
