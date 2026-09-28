/**
 * Описание товара: HTML из визивига админки или простой текст старых карточек.
 *
 * На странице описание выводится через v-html, поэтому всё проходит через
 * белый список. Санитайзер не вычищает чужую разметку, а собирает свою:
 * каждый разрешённый тег пересобирается с нуля без атрибутов (у ссылки —
 * только проверенный href), любой другой «<» экранируется, незакрытые теги
 * закрываются. Обходить незакрытыми тегами и хитрыми атрибутами нечего:
 * на выходе нет разметки, которую написал не этот код.
 *
 * DOMPurify не подходит: ему нужен DOM, а описание рендерится и на сервере.
 *
 * Типы в JSDoc, а не аннотациями — как в соседних useProductPrice.ts и useSeoText.ts.
 */

const ALLOWED_TAGS = new Set([
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's',
  'ul', 'ol', 'li', 'h2', 'h3', 'h4', 'blockquote', 'a',
]);
const VOID_TAGS = new Set(['br']);
const BLOCK_TAGS = new Set(['p', 'li', 'h2', 'h3', 'h4', 'blockquote', 'ul', 'ol']);

const TAG_RE = /^<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:\s[^<>]*)?)>/;
const HREF_RE = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i;
// Схему проверяем по сырому значению: сущности вроде &#106; не превратят
// строку, начинающуюся с «https://» или «/», в javascript:.
const SAFE_HREF_RE = /^(https?:\/\/|\/|#|mailto:|tel:)/i;

const escapeHtml = (text) => String(text)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

/** Похоже ли описание на HTML, а не на простой текст. */
export const isRichText = (value) => /<\/?[a-z][a-z0-9]*(\s[^<>]*)?\/?>/i.test(String(value || ''));

const buildLink = (attrs) => {
  const match = attrs.match(HREF_RE);
  const href = (match?.[1] ?? match?.[2] ?? match?.[3] ?? '').trim();
  if (!href || !SAFE_HREF_RE.test(href)) return '<a>';
  const safe = href.replace(/"/g, '&quot;').replace(/</g, '%3C').replace(/>/g, '%3E');
  // Внутренние ссылки — обычные: ради перелинковки их и ставят.
  // Внешние — в новой вкладке и без передачи веса.
  if (/^https?:\/\//i.test(href)) {
    return `<a href="${safe}" target="_blank" rel="nofollow noopener noreferrer">`;
  }
  return `<a href="${safe}">`;
};

/**
 * HTML из визивига → безопасный HTML из белого списка тегов.
 * @param {string} html
 * @returns {string}
 */
export function sanitizeRichText(html) {
  const source = String(html || '');
  const open = [];
  let out = '';
  let i = 0;

  while (i < source.length) {
    const lt = source.indexOf('<', i);
    if (lt === -1) {
      out += source.slice(i).replace(/>/g, '&gt;');
      break;
    }
    out += source.slice(i, lt).replace(/>/g, '&gt;');

    const match = source.slice(lt).match(TAG_RE);
    const tag = match?.[2].toLowerCase();
    if (!match || !ALLOWED_TAGS.has(tag)) {
      // Комментарий, <script>, <img onerror>, незакрытая скобка — в текст.
      // Скрипт и стиль выбрасываем вместе с содержимым.
      const dropped = match && /^(script|style)$/.test(tag) && !match[1]
        ? source.slice(lt).match(new RegExp(`^[\\s\\S]*?</${tag}\\s*>`, 'i'))
        : null;
      if (dropped) {
        i = lt + dropped[0].length;
      } else if (match) {
        i = lt + match[0].length;
      } else {
        out += '&lt;';
        i = lt + 1;
      }
      continue;
    }

    i = lt + match[0].length;
    const isClosing = match[1] === '/';

    if (VOID_TAGS.has(tag)) {
      if (!isClosing) out += `<${tag}>`;
      continue;
    }

    if (!isClosing) {
      out += tag === 'a' ? buildLink(match[3]) : `<${tag}>`;
      open.push(tag);
      continue;
    }

    // Закрывающий тег без пары выбрасываем, с парой — закрываем всё, что
    // открыто внутри неё: иначе «<strong>» без конца на сервере сделает
    // жирным полстраницы после описания.
    const idx = open.lastIndexOf(tag);
    if (idx === -1) continue;
    while (open.length > idx) out += `</${open.pop()}>`;
  }

  while (open.length) out += `</${open.pop()}>`;
  return out;
}

/**
 * Описание для страницы: HTML — через санитайзер, простой текст — абзацами.
 * @param {string} value
 * @returns {string}
 */
export function descriptionHtml(value) {
  const text = String(value || '').trim();
  if (!text) return '';
  if (isRichText(text)) return sanitizeRichText(text);
  return text
    .split(/\n\s*\n/)
    .map((para) => `<p>${escapeHtml(para.trim()).replace(/\n/g, '<br>')}</p>`)
    .join('');
}

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', laquo: '«', raquo: '»', mdash: '—', ndash: '–',
};

/**
 * Описание простым текстом — для meta description, разметки и фида.
 * Абзацы и пункты списков разделяются переводом строки: по нему фид
 * режет описание на предложения.
 * @param {string} value
 * @returns {string}
 */
export function richTextToPlain(value) {
  const text = String(value || '');
  if (!isRichText(text)) return text.trim();
  return text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?([a-z][a-z0-9]*)[^>]*>/gi, (tag, name) => (BLOCK_TAGS.has(name.toLowerCase()) ? '\n' : ''))
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, code) => {
      if (code[0] === '#') {
        const num = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
        return Number.isFinite(num) ? String.fromCodePoint(num) : entity;
      }
      return ENTITIES[code.toLowerCase()] ?? entity;
    })
    .replace(/[ \t ]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .trim();
}
