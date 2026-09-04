/**
 * Сборка SEO-текстов с гарантией по длине.
 *
 * Google обрезает title примерно на 60 символах, description — на 160.
 * Раньше карточка склеивала заголовок из названия с выбранной опцией и доходила
 * до 146 символов, а description выливал в себя всё описание товара целиком —
 * до 608. Здесь текст собирается из частей: сначала отбрасывается наименее
 * ценное (суффикс бренда, потом цена, потом город) и лишь в последнюю очередь
 * режется само название.
 *
 * Типы намеренно в JSDoc, а не аннотациями: eslint проекта без TS-парсера,
 * соседний useSiteUrl.ts написан так же.
 */

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 160;

const TITLE_PREFIX = 'Купить ';
const TITLE_CITY = ' в Рязани';
const TITLE_BRAND = ' | РК-Тек';

const DESC_TAIL = 'Оригинал, гарантия 1 год, доставка по Рязани в день заказа.';
/** Ниже этого порога от описания товара остаётся огрызок — лучше не включать вовсе. */
const DESC_MIN_ROOM = 40;

/**
 * Обрезает текст по границе слова и ставит многоточие.
 * @param {string} text
 * @param {number} max
 * @returns {string}
 */
export function clip(text, max) {
  const t = (text || '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  if (max <= 1) return '…';

  const budget = max - 1; // место под многоточие
  let body = t.slice(0, budget);

  // Откатываемся к границе слова, только если слово реально разорвано:
  // при t[budget] === ' ' префикс и так кончается целым словом
  if (t[budget] !== ' ') {
    const lastSpace = body.lastIndexOf(' ');
    // ...и только если так не потеряется больше трети бюджета
    if (lastSpace > budget * 0.6) body = body.slice(0, lastSpace);
  }

  body = body.replace(/[\s,.;:—–-]+$/, '');
  // Повисший хвост вида «5 Pro 2…» — число или одиночный символ без продолжения
  body = body.replace(/\s+(?:\d+|.)$/u, '');
  return `${body}…`;
}

/**
 * Формы названия от полной к короткой: целиком, без скобочного уточнения,
 * без всего после первой запятой. Так «Dyson V15S Detect SV47, никель (Nickel)»
 * сжимается до «Dyson V15S Detect SV47» без потери модели.
 * @param {string} name
 * @returns {string[]}
 */
function nameForms(name) {
  const full = (name || '').replace(/\s+/g, ' ').trim();
  const forms = [full];

  const paren = full.indexOf(' (');
  if (paren > 2) forms.push(full.slice(0, paren).trim());

  const comma = full.indexOf(',');
  if (comma > 2) forms.push(full.slice(0, comma).trim());

  return [...new Set(forms)]
    .filter((form) => form.length > 2)
    .sort((a, b) => b.length - a.length);
}

/**
 * Заголовок карточки товара. Порядок жертв при нехватке места:
 * бренд, затем цена, затем город, и только потом длина названия —
 * модель это и есть поисковый запрос, а локальный сигнал дублируется
 * в H1, description и разметке LocalBusiness.
 * @param {string} name базовое product.name, без выбранных опций
 * @param {string} [priceLabel] например «138 000 ₽»
 * @returns {string}
 */
export function buildProductTitle(name, priceLabel = '') {
  const forms = nameForms(name);
  if (!forms.length) return `Интернет-магазин техники${TITLE_CITY}${TITLE_BRAND}`;

  const price = priceLabel ? ` — ${priceLabel}` : '';
  const candidates = [];

  forms.forEach((form) => {
    candidates.push(`${TITLE_PREFIX}${form}${TITLE_CITY}${price}${TITLE_BRAND}`);
    candidates.push(`${TITLE_PREFIX}${form}${TITLE_CITY}${price}`);
  });
  forms.forEach((form) => candidates.push(`${TITLE_PREFIX}${form}${TITLE_CITY}`));
  forms.forEach((form) => candidates.push(`${TITLE_PREFIX}${form}`));

  const fit = candidates.find((title) => title.length <= TITLE_MAX);
  if (fit) return fit;

  // Даже самая короткая форма длиннее бюджета — режем её
  const room = TITLE_MAX - TITLE_PREFIX.length - TITLE_CITY.length;
  return `${TITLE_PREFIX}${clip(forms[forms.length - 1], room)}${TITLE_CITY}`;
}

/**
 * Description карточки: название с ценой, затем собственное описание товара
 * ровно настолько, насколько хватает бюджета, затем постоянные выгоды.
 * Заголовок не повторяется — он и так виден в выдаче строкой выше.
 * @param {{ name: string, priceLabel?: string, description?: string }} input
 * @returns {string}
 */
export function buildProductDescription(input) {
  const { name, priceLabel = '', description = '' } = input;

  const price = priceLabel ? ` — ${priceLabel}` : '';
  const headRoom = Math.max(24, DESCRIPTION_MAX - DESC_TAIL.length - price.length - 2);
  const namePart = name ? clip(name, headRoom) : '';
  const head = namePart ? `${namePart}${price}.` : '';

  const parts = head ? [head] : [];
  // Части склеиваются пробелом, поэтому вычитаем и разделители
  const room = DESCRIPTION_MAX - DESC_TAIL.length - 1 - (head ? head.length + 1 : 0);
  if (description && room >= DESC_MIN_ROOM) parts.push(clip(description, room));
  parts.push(DESC_TAIL);

  return parts.join(' ');
}

/**
 * Заголовок вида «Текст — Бренд»: бренд отбрасывается, если из-за него не влезает.
 * @param {string} text
 * @param {string} [brand]
 * @returns {string}
 */
export function withBrand(text, brand = 'РК-Тек') {
  const t = (text || '').replace(/\s+/g, ' ').trim();
  const full = `${t} — ${brand}`;
  return full.length <= TITLE_MAX ? full : clip(t, TITLE_MAX);
}

/** Страховка для написанных руками строк. */
export const clipTitle = (text) => clip(text, TITLE_MAX);
export const clipDescription = (text) => clip(text, DESCRIPTION_MAX);
