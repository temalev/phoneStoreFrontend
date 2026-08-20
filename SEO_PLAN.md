# План улучшения SEO — рк-тек.рф

Документ составлен на основе аудита текущего состояния (Nuxt 3 SSR, домен `рк-тек.рф`).
Шаги отсортированы от наиболее влиятельных и дешёвых к более трудозатратным.

---

## 0. Что уже сделано хорошо (не трогать)

- SSR включён ([nuxt.config.js:15](nuxt.config.js#L15)) — критично для индексации.
- `link rel=canonical` на всех ключевых страницах (index, [uuid], [category], blog, blog/[slug], contacts).
- JSON-LD: `Product`, `BreadcrumbList`, `LocalBusiness` (Рязань + Москва), `Blog`, `OfferCatalog`.
- OG-теги + Twitter cards с указанием `og:image:width/height`.
- Динамический `/sitemap.xml` ([server/routes/sitemap.xml.get.ts](server/routes/sitemap.xml.get.ts)) с товарами из API.
- 301-редиректы со старых URL `/product/*` и `/item/*` ([nuxt.config.js:50-63](nuxt.config.js#L50-L63)).
- Верификации Яндекс/Google/Mail.ru проставлены ([nuxt.config.js:25-29](nuxt.config.js#L25-L29)).
- Внутренние ссылки идут через `NuxtLink` (SPA-навигация без потери indexability).

---

## 1. Технические быстрые победы (1–2 часа работы, большой эффект)

### 1.1. Исправить `robots.txt` ✅ DONE (2026-05-17)
Файл: [public/robots.txt](public/robots.txt)

Проблемы:
- Пустая строка `Disallow:` рядом с `Disallow: /admin/` — выглядит подозрительно для роботов. ✅ убрано
- Не закрыты технические маршруты: `/OrdersList`, `/PromocodesList`, параметры корзины. ✅ добавлено
- `/item/` и `/product/` оставлены открытыми — у них 301-редиректы, бот должен их пройти и обновить индекс.
- `Host:` директива **не добавлена** — Яндекс отказался от неё в 2018, теперь использует 301 + canonical.
- Добавлен блок `User-agent: Yandex` с `Clean-param` для UTM/`from`/`ref`/`gclid`/`yclid` — лучший способ склейки URL-параметров для Яндекса (учитывая активный трекинг `from`).
- URL sitemap пока на кириллице — будет переведён на Punycode вместе с шагом 1.2.

### 1.2. Перевести все ссылки в `sitemap.xml` и canonical на Punycode ✅ DONE (2026-05-17)
Файлы: [server/routes/sitemap.xml.get.ts:10](server/routes/sitemap.xml.get.ts#L10), все `useHead({ link: [{ rel: 'canonical' ... }] })`.

Проблема: кириллический домен `https://рк-тек.рф` в `<loc>` и `<link rel=canonical>`.
Яндекс и Google понимают IRI, но Punycode-форма более надёжна, особенно для парсеров и аналитики, которые ломаются на не-ASCII.

**Реальный Punycode:** `xn----jtbnc0ao.xn--p1ai` (в исходной версии плана было ошибочное значение).

Что сделано:
- ✅ Создан [composables/useSiteUrl.ts](composables/useSiteUrl.ts) с экспортом `SITE_URL` (Punycode) и `SITE_URL_DISPLAY` (кириллица — только для отображения).
- ✅ Заменены URL в SEO-метатегах:
  - [server/routes/sitemap.xml.get.ts](server/routes/sitemap.xml.get.ts) — `<loc>` в sitemap
  - [server/routes/yandex-feed.xml.get.ts](server/routes/yandex-feed.xml.get.ts) — Я.Маркет фид
  - [public/robots.txt](public/robots.txt) — `Sitemap:` директива
  - [pages/index.vue](pages/index.vue) — canonical, og:url, JSON-LD `@id`, `url`, sameAs
  - [pages/[uuid].vue](pages/[uuid].vue)
  - [pages/[category]/index.vue](pages/[category]/index.vue)
  - [pages/blog/index.vue](pages/blog/index.vue) — заменены 6 хардкод-вхождений
  - [pages/blog/[slug].vue](pages/blog/[slug].vue)
  - [pages/contacts.vue](pages/contacts.vue)
  - [pages/accessories/index.vue](pages/accessories/index.vue), [pages/accessories/[id]/index.vue](pages/accessories/[id]/index.vue)
  - [pages/other/index.vue](pages/other/index.vue), [pages/other/[id]/index.vue](pages/other/[id]/index.vue)
- Email-адреса `info@рк-тек.рф` и видимый текст в футере оставлены на кириллице — это не URL.

### 1.3. Атрибуты `width`/`height`/`loading`/`alt` на всех `<img>`
Карточка товара: [components/cardProduct/index.vue:4](components/cardProduct/index.vue#L4) — нет `width`, `height`, `loading="lazy"`. Это бьёт по CLS (Cumulative Layout Shift) — Core Web Vital, влияющий на ранжирование.

Что сделать (по всему проекту):
- `<img loading="lazy" decoding="async" width="..." height="..." />` для всех листинговых изображений.
- На главной картинке (above the fold) — `loading="eager"` + `fetchpriority="high"`.
- `alt` должен описывать товар + бренд: `iPhone 16 Pro Max 256GB Titanium`, а не просто `${product.name}`.
- Фон `welcome` ([pages/index.vue:252](pages/index.vue#L252)) — добавить `<link rel="preload" as="image" href="/images/mainPageBackground.webp">` в `useHead({ link: [...] })`.

### 1.4. Sitemap — поделить на `sitemap_index` и почистить
Файл: [server/routes/sitemap.xml.get.ts](server/routes/sitemap.xml.get.ts)

Проблемы:
- Все товары и блог в одном файле — при >50k URL Google перестанет читать. Сейчас не критично, но задел.
- Хардкод блог-постов (строки 62-69) — должен браться из `data/blogPosts.js`.
- Подкатегории `accessories/*`, `other/*` хардкожены — должен быть сгенерирован из стора категорий.
- `<lastmod>` для статических страниц = сегодня каждый запрос — роботы будут думать, что страница меняется ежедневно. Лучше зафиксировать дату последнего деплоя или дату последнего изменения.
- Нет `image:image` расширения для товаров.

Что сделать:
1. Хардкод блогов заменить на `import { blogPosts } from '~/data/blogPosts'`.
2. Подкатегории брать из `stores/categories.js`.
3. Добавить `<image:image>` для каждого товара (помогает в Яндекс.Картинках).
4. Завести отдельный `sitemap_index.xml` с разделами: pages, products, blog (готовиться к росту).
5. Для статических URL `lastmod` брать из `process.env.BUILD_TIME` или git-хэша билда.

### 1.5. Удалить переусердствование с `keywords` ✅ DONE (2026-05-17)
Файлы: [pages/index.vue](pages/index.vue), [pages/[uuid].vue](pages/[uuid].vue), [pages/[category]/index.vue](pages/[category]/index.vue), [pages/contacts.vue](pages/contacts.vue), [pages/accessories/index.vue](pages/accessories/index.vue), [pages/accessories/[id]/index.vue](pages/accessories/[id]/index.vue), [pages/other/index.vue](pages/other/index.vue), [pages/other/[id]/index.vue](pages/other/[id]/index.vue).

Google игнорирует `<meta name=keywords>` с 2009, Яндекс перестал учитывать ~2015. Сейчас перечисление городов и фраз вида «купить iphone, iphone цена, iphone москва, iphone рязань» выглядит как переспам и может, наоборот, понизить позиции.

Что сделано: тег удалён полностью со всех 8 страниц + удалён `const keywords = computed(...)` в `[uuid].vue`. Поля `keywords` в data-объектах (`descriptions`, `accessoryDescriptions`, `otherDescriptions`) оставлены — будут вычищены в общей рефакторинг-сессии (минимальный диф).

### 1.6. Aggregate Rating: убрать или подтянуть к реальным данным
Файлы: [pages/index.vue:166-173,196-203](pages/index.vue#L166-L173)

Сейчас оба `LocalBusiness` (Рязань и Москва) имеют идентичный `ratingValue: 5.0, ratingCount: 100, reviewCount: 77`. Это:
- Дубликат — Google и Яндекс считают такое разметкой-«накруткой».
- Цифры неживые — постоянное `5.0` без отзывов в JSON-LD легко классифицируется как spammy structured data.

Что сделать:
1. Завести в админке/API сущность `reviews`, отдавать в JSON-LD реальные значения.
2. Включать `Review` items в `aggregateRating` (массив `review`).
3. Иначе — **удалить** `aggregateRating` совсем, оставив только `Organization/LocalBusiness` без рейтинга. Лучше никакого рейтинга, чем санкции.

---

## 2. Контентные улучшения (умеренный труд, большой эффект)

### 2.1. Уникальный, развёрнутый текст на категорийных страницах
Файл: [pages/[category]/index.vue:66-166](pages/[category]/index.vue#L66-L166)

Сейчас на `/iphone`, `/ipad`, `/mac` есть короткое описание (1 предложение) + список товаров. Это «тонкая страница» (thin content) — частая причина низких позиций по коммерческим запросам.

Что сделать на каждой категории:
- **H1**: «iPhone — купить в Рязани и Москве» (как сейчас).
- **Lead-параграф** (200-300 слов): чем категория полезна, какие модели, отличия поколений.
- **H2 «Популярные модели»** — список + ссылки на конкретные товары.
- **H2 «Сколько стоит iPhone в Рязани»** — диапазон цен, что влияет на цену.
- **H2 «Гарантия и доставка»** — конкретика по городам.
- **H2 «Часто задаваемые вопросы»** — 4-6 FAQ с `FAQPage` schema.
- Внутренние ссылки на смежные категории (`/airpods`, `/watch` из `/iphone`).

Каждая категория должна иметь индивидуальный текст ~500-1000 слов. Хранить в `data/categoryContent.js` (как `blogPosts.js`).

### 2.2. FAQPage schema на категорийных и продуктовой страницах
После добавления FAQ-блока (п. 2.1) — поднять Rich Result в выдаче (раскрытые ответы прямо в SERP).

Что сделать: в `useHead({ script: [...] })` добавить:
```js
{
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '...', acceptedAnswer: { '@type': 'Answer', text: '...' } },
    ...
  ]
}
```

### 2.3. На карточке товара ([pages/[uuid].vue](pages/[uuid].vue)) добавить блоки
- **Характеристики** (`<dl>` с парами ключ/значение) — критично, сейчас только короткое `description`.
- **Описание** в развёрнутом виде (3-5 абзацев, H2-подзаголовки).
- **Блок отзывов** (даже 3-5 реальных) — `Review` schema на каждом.
- **«Похожие товары»** — внутренняя перелинковка.
- **«Купить в кредит / Trade-in»** — коммерческие триггеры.

Сейчас контент карточки = 1 предложение `description` + кнопка. По коммерческим запросам типа «купить iphone 16 pro» страница проигрывает Wildberries/М.Видео именно из-за пустоты.

### 2.4. Заголовок и описание продуктовой страницы — длина
Файл: [pages/[uuid].vue:341-342](pages/[uuid].vue#L341-L342)

Текущий шаблон: `Купить ${displayName.value} ${priceStr}в Москве и Рязани | РК-Тек` — для длинных названий (например `Apple iPhone 16 Pro Max 256GB Black Titanium — С шумоподавлением`) выходит за 60 символов, Google обрежет.

Что сделать:
- Title ≤ 60 символов: `Купить ${product.name} в Рязани — ${formattedPrice} ₽`.
- Description ≤ 160 символов, описывать выгоду, а не повторять title.
- Завести функцию `truncateTitle(s, 60)` и применять везде.

### 2.5. Блог: расширить и связать
Файл: [pages/blog/[slug].vue](pages/blog/[slug].vue), [data/blogPosts.js](data/blogPosts.js)

- Добавить блок «Купить в магазине» в каждой статье — внутренняя ссылка на категорию.
- Использовать `<time datetime="...">` (сейчас просто `formatDate`).
- `Article` JSON-LD — добавить `author`, `publisher`, `mainEntityOfPage`, `image` массивом (1:1, 4:3, 16:9 — требование Google News).
- Использовать `<h2>`, `<h3>` внутри `post.content`, не вёрстку через `<div>`. Проверить, что в `data/blogPosts.js` HTML уже размечен правильно.

### 2.6. Главная страница: title и H1
Файл: [pages/index.vue:6,21](pages/index.vue#L6)

- В `<title>` (Nuxt config) указано «РК Тек - интернет магазин техники и аксессуаров Apple и Dyson» — повторяется в `useHead`. `useHead` перебивает — но конфликт легко устранить.
- H1 = «РК Тек» — это бренд, а не SEO-заголовок. Заменить на «Купить технику Apple и Dyson в Рязани и Москве — РК Тек» (или через `aria-label`, если важна визуальная подача).

### 2.7. Уникальные `og:image` для каждой страницы
Сейчас на большинстве страниц `og:image = /images/mainPageBackground.webp`. Лучше:
- Категория: иконка из `descriptions[i].img`.
- Товар: первое изображение варианта.
- Блог-пост: `post.image`.
- Главная: специальный баннер 1200×630 px с CTA.

Большая часть уже сделана; убедиться, что fallback используется только при отсутствии изображения, не как дефолт.

---

## 3. Производительность и Core Web Vitals

Core Web Vitals — фактор ранжирования Google (Page Experience).

### 3.1. Аудит Lighthouse
Запустить `npx unlighthouse --site https://рк-тек.рф`. Цели:
- LCP < 2.5 c (главное LCP-изображение — `mainPageBackground.webp`).
- CLS < 0.1 (после п. 1.3 должно стать ОК).
- INP < 200 ms.

### 3.2. Шрифты ✅ DONE (2026-05-18)
- ✅ `material-symbols` — **subset 14 нужных глифов** (`arrow_forward, article, bolt, call, info, location_on, mail, map, phone_iphone, redeem, schedule, search_off, sell, support_agent`).
  - Был: TTF, **1.18 МБ**, ~3000 глифов.
  - Стал: WOFF2, **3.5 КБ**. **-99.7%**.
  - Получен через Google Fonts CSS API с параметром `icon_names=...`. Self-hosted в [public/fonts/](public/fonts/).
- ✅ Добавлен `font-feature-settings: 'liga'` в CSS — критично для корректной работы ligatures (превращение слова `arrow_forward` в иконку). В старом CSS этого не было.
- ✅ Все веб-шрифты с `font-display: swap` — было до правок.
- ✅ `<link rel="preload" as="font" type="font/woff2" crossorigin>` для иконочного шрифта добавлен в [nuxt.config.js](nuxt.config.js#L33) — браузер качает шрифт параллельно с HTML, нет FOIT/FOUT.
- Google Fonts не используется (всё self-hosted) — `preconnect` к `fonts.googleapis.com` не нужен.

**Проверено в prod-сборке** (`npm run build` + preview):
- CSS path: `/_nuxt/entry.*.css` → `url(../fonts/material-symbols-rounded-400.subset.woff2)` → `/fonts/...`
- Preload в HTML: `<link rel="preload" ... href="/fonts/material-symbols-rounded-400.subset.woff2">`
- URL совпадают → preload работает, шрифт загружается один раз.

### 3.3. Изображения
- Все ключевые изображения — WebP/AVIF, есть.
- Добавить `srcset` для `<img>` с разными `w` (480, 768, 1200) — мобильный трафик ~70% в РФ.
- Опционально подключить `@nuxt/image` для автоматики.

### 3.4. JS-бандл ✅ DONE (частично, 2026-05-18)
**Аудит выявил:**
- `moment.js` — **60 КБ**, использовался ТОЛЬКО в админских страницах для `format('DD.MM.YYYY')` (3 файла) + 1 файл с мёртвым импортом.
- `assets/icons/rk.svg` — **92 КБ**, NuxtIcon-ассет, **никем не используется** (`<NuxtIcon name="rk" />` нет в коде). Логотип в хедере грузится из `/icons/rk.png` (public/).
- Element Plus tree-shake-ается корректно — `el-table` (80 КБ), `el-switch` (17 КБ) грузятся только при заходе на админ-страницы.
- Все админ-роуты (`admin.js` 140 КБ, `OrdersList`, `PromocodesList`) уже lazy-load через Nuxt-роутинг.

**Сделано:**
- ✅ Удалён `moment` + `@nuxtjs/moment` из [package.json](package.json), заменён на нативный `Intl.DateTimeFormat`:
  - [pages/PromocodesList.vue](pages/PromocodesList.vue)
  - [pages/OrdersList.vue](pages/OrdersList.vue)
  - [pages/admin.vue](pages/admin.vue) — был только мёртвый импорт.
- ✅ Удалён неиспользуемый `assets/icons/rk.svg` (92 КБ).

**Измеренный эффект (build + preview):**
| Страница | JS до | JS после | Экономия |
|---|---|---|---|
| Главная `/` | ~593 КБ | **502.7 КБ** | −90 КБ (−15%) |
| Админ-страницы | + 60 КБ moment | (нет moment) | −60 КБ |

**Не сделано (требует крупных правок):**
- `blogPosts.js` (55 КБ) — содержит full HTML всех 7 статей блога, грузится на каждой странице через footer-store. Можно разделить мета/контент, но это сложнее. Отдельная итерация.
- Lazy-load модалок через `defineAsyncComponent` — модалки уже под `v-if`, грузятся при открытии. Дополнительная оптимизация низкого приоритета.
- `useAsyncData` в `[uuid].vue` — SSR-блокировка нужна для SEO (контент должен быть в HTML), не трогаем.

### 3.5. HTTP-заголовки кеширования ✅ DONE (2026-05-18)
Применено на VPS, файл `/etc/nginx/sites-enabled/default` + snippets в `/etc/nginx/snippets/`.

**Cache-Control:**
| URL | Cache-Control | Зачем |
|---|---|---|
| HTML `/`, `/*` | `public, max-age=300` | 5 мин — свежесть данных корзины/цен |
| `/_nuxt/*` (хешированные имена) | `public, max-age=31536000, immutable` | 1 год, безопасно — хэш в имени |
| `/fonts/*` | `public, max-age=31536000, immutable` | 1 год, шрифт почти не меняется |
| `/images/*`, `/icons/*` | `public, max-age=2592000` | 30 дней (имена не хешированные) |
| `/favicon.*`, `/robots.txt` | `public, max-age=2592000` | 30 дней |
| `/sitemap.xml` | `public, max-age=300, s-maxage=3600` | 5 мин у клиента / 1 час у CDN |

**Security headers** (через `/etc/nginx/snippets/security-headers.conf`):
- `Strict-Transport-Security: max-age=31536000` (1 год; без `includeSubDomains` для безопасной поэтапной раскатки)
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: SAMEORIGIN`

**Применено на server-блоки:**
- ✅ `xn----jtbnc0ao.xn--p1ai` (= `рк-тек.рф`) — прод
- ✅ `alpha.xn----jtbnc0ao.xn--p1ai` — альфа
- ⚠️ `rk-tech.shop` и `alpha.rk-tech.shop` — конфиг применён, но **SSL-сертификат истёк в апреле 2024**, домены недоступны по HTTPS. Это до-эта-сессионная проблема — нужно либо обновить Let's Encrypt через `certbot renew`, либо удалить эти server-блоки из конфига.

**Бэкап старого конфига:** `/etc/nginx/backups/default.bak-20260518-220459`.

---

## 4. Структура сайта и индексация

### 4.1. Корректная обработка 404 ✅ DONE (2026-05-21)
Файлы:
- [pages/[uuid].vue](pages/[uuid].vue) — товар не найден
- [pages/blog/[slug].vue](pages/blog/[slug].vue) — статья не найдена
- [pages/accessories/[id]/index.vue](pages/accessories/[id]/index.vue) — раздел ∉ {case, cable, mouse}
- [pages/other/[id]/index.vue](pages/other/[id]/index.vue) — бренд ∉ {marshall, dji, xiaomi, jbl, dreame}

Все 4 страницы теперь делают:
```js
throw createError({ statusCode: 404, statusMessage: 'Not Found', fatal: true });
```

**Важно:** `statusMessage` должен быть ASCII — кириллица ломает Node http layer (`ERR_INVALID_CHAR`), что роняет SSR с 504. UI-текст пользователю даёт [error.vue](error.vue) (там и так есть `robots: noindex, nofollow`).

Проверено на проде (`https://xn----jtbnc0ao.xn--p1ai`):
- `/no-such-product` → `HTTP 404 Not Found` ✅
- `/blog/no-such-article` → `HTTP 404` ✅
- `/other/unknown-brand` → `HTTP 404` ✅
- `/accessories/unknown` → `HTTP 404` ✅
- Реальные `/iphone`, `/` → `HTTP 200` ✅

### 4.2. Хлебные крошки на всех страницах
Сейчас крошки есть на товаре, категории, блоге. Добавить на:
- `/accessories`, `/accessories/[id]`, `/other`, `/other/[id]`.
- Главную (вырезать — на главной не нужны).

### 4.3. Внутренняя перелинковка через футер ✅ DONE (2026-05-17)
[components/theFooter.vue](components/theFooter.vue) — добавить ссылки на:
- Все 10+ категорий. ✅ (включая ранее скрытые Canon, Whoop)
- Популярные подкатегории (`accessories/case`, `accessories/cable`, `accessories/mouse`). ✅
- Подбренды раздела «Другое» (Marshall, DJI, Xiaomi, JBL, Dreame) — ранее «сиротские» URL в sitemap. ✅
- Блог + 4 свежих статьи (автоматически по дате из `data/blogPosts.js`). ✅
- Контакты, доставка, оплата, оригинальность, гарантия лучшей цены. ✅
- `aria-label` на каждом `<nav>` для доступности и семантики. ✅

Сейчас в шапке только основные категории; футер даёт «sitewide internal links» и сильно помогает индексации низкочастотных страниц.

### 4.4. Пагинация на категориях с большим количеством товаров
Если в `/iphone` >24 товаров — добавить пагинацию `?page=2` и `<link rel="prev/next">`. Сейчас, судя по странице, всё в одном списке. При росте каталога это станет проблемой (большой DOM = плохой LCP).

### 4.5. Канонические URL для фильтров и опций (если появятся)
Если будут фильтры по цвету/памяти — фильтрованные URL должны иметь `rel=canonical` на чистую категорию + `meta robots: noindex, follow`.

---

## 5. Локальное SEO (Рязань + Москва)

### 5.1. Отдельные посадочные на города
Создать страницы:
- `/ryazan` — «Магазин техники Apple в Рязани, ул. Кольцова, 12»
- `/moscow` — «Магазин техники Apple в Москве, Багратионовский проезд, 7к2»

С полноценным контентом, картой, фото магазина, отзывами, ссылками на популярные товары «в наличии в Рязани».

### 5.2. Разделить `LocalBusiness` правильно
Сейчас оба бизнеса в `@graph` на главной с одинаковым `aggregateRating` (см. п. 1.6). После разделения — у каждого свой `priceRange`, `openingHoursSpecification`, `geo` (широта/долгота).

```js
{
  '@type': 'Store',
  geo: { '@type': 'GeoCoordinates', latitude: 54.6269, longitude: 39.6916 },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', ...], opens: '10:00', closes: '20:00' }
  ],
  priceRange: '₽₽',
}
```

### 5.3. Яндекс.Бизнес + Google Business Profile
Внешние действия (не код):
- Заполнить карточки обоих магазинов в Яндекс.Бизнесе (фото, услуги, акции, отзывы).
- Google Business Profile для Москвы (для иностранных пользователей и Google Maps в РФ).
- Привязать карточки к домену — даёт «знание-граф» в выдаче.

---

## 6. Аналитика и мониторинг

### 6.1. Метрика, GA4, Search Console
- Подтвердить владение в Яндекс.Вебмастер и Google Search Console (верификация в HTML уже стоит, проверить, что подтверждено в кабинетах).
- Настроить отправку sitemap в обоих сервисах.
- Включить отчёт «Покрытие» — еженедельная проверка ошибок индексации.

### 6.2. Я.Метрика
- Включить «Карта кликов», «Вебвизор», цели на «Добавить в корзину», «Оформить заказ», «Клик по телефону».
- Подключить `ecommerce`-события — пригодится для подсчёта конверсии из органики.

### 6.3. Базовый дашборд позиций
- Подключить топ-30 запросов в Topvisor/Megaindex/Serpstat.
- Еженедельно: позиции, CTR, импрессии (из Search Console API).
- Алерт при просадке позиций по коммерческим ключам.

---

## 7. Долгосрочные улучшения

### 7.1. Hreflang (если будет английская версия)
Не актуально, пока сайт только RU.

### 7.2. Schema `Product` — `mpn`, `gtin`, `sku`
Файл: [pages/[uuid].vue:416-422](pages/[uuid].vue#L416)

Сейчас `Product` без `sku`/`mpn`/`gtin`. Google Merchant Center и Я.Маркет требуют их для бесплатных карточек. Добавить из API.

### 7.3. Микроразметка `HowTo` для блог-инструкций
В постах «Как перенести данные на новый iPhone», «Жёсткий сброс iPhone» — использовать `HowTo` JSON-LD. Даёт особый Rich Result в Google.

### 7.4. PWA / Manifest
- Создать `public/manifest.webmanifest`.
- Добавить `<link rel="manifest">`, `<meta name="theme-color">`.
- Поможет в мобильной выдаче.

### 7.5. AMP
**Не делать.** AMP мёртв с 2021 года (Google убрал требование), вкладывать ресурсы бесполезно.

### 7.6. Я.Маркет / Я.Турбо-страницы
- Я.Маркет — если есть бюджет, выгрузка через `/yandex-feed.xml` (уже есть в [server/routes](server/routes/yandex-feed.xml.get.ts)). Проверить, что фид валиден.
- Турбо-страницы — устаревшая технология, не использовать.

---

## Приоритизация — что делать в первую очередь

**Спринт 1 (1-2 дня):**
- [x] 1.1. Robots.txt ✅ (2026-05-17)
- [ ] 1.3. width/height/loading на `<img>`
- [x] 1.5. Убрать keywords-спам ✅ (2026-05-17)
- [ ] 1.6. Убрать/починить aggregateRating
- [ ] 4.1. 404 через createError на товаре

**Спринт 2 (3-5 дней):**
- [x] 1.2. Punycode в canonical/sitemap ✅ (2026-05-17)
- [ ] 1.4. Sitemap из stores + image:image
- [ ] 2.1. Контент на категорийных страницах (по одной категории в день)
- [ ] 2.4. Truncate title/description
- [x] 4.3. Внутренние ссылки в футере ✅ (2026-05-17)

**Спринт 3 (1-2 недели):**
- [ ] 2.3. Расширение карточки товара (характеристики, отзывы, похожие)
- [ ] 2.2. FAQPage schema
- [~] 3.1–3.5. Core Web Vitals — 3.2 (шрифты) ✅, 3.4 (JS-бандл) ✅, 3.5 (HTTP-заголовки) ✅ (2026-05-18); 3.1 (Lighthouse), 3.3 (srcset/AVIF) — открыты
- [ ] 5.1–5.2. Локальное SEO

**Постоянная работа:**
- 2.5. Блог — 2-3 статьи в месяц.
- 6.1–6.3. Мониторинг.

---

## Ожидаемые эффекты

| Шаг | Эффект | Через сколько |
|---|---|---|
| 1.1–1.6 | Чистая индексация, нет санкций | 2-4 недели |
| 2.1, 2.3 | Рост по среднечастотникам | 1-3 месяца |
| 3.x | +5-15% к CTR из выдачи (Core Web Vitals) | 1-2 месяца |
| 5.x | Топ-3 в локальной выдаче «Apple Рязань» | 2-4 месяца |
| 4.x + футер | Индексация long-tail (товары) +30-50% URL | 1-2 месяца |
