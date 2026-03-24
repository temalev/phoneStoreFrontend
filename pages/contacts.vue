<!-- eslint-disable max-len -->
<template>
  <div class="contacts-page">
    <div class="contacts-page__inner">

      <nav class="contacts-page__breadcrumbs" aria-label="Хлебные крошки">
        <NuxtLink to="/" class="contacts-page__crumb">Главная</NuxtLink>
        <span class="contacts-page__sep">/</span>
        <span class="contacts-page__crumb contacts-page__crumb--current">Контакты</span>
      </nav>

      <h1 class="contacts-page__title">Контакты</h1>
      <p class="contacts-page__subtitle">Мы работаем в Рязани и Москве. Свяжитесь с нами любым удобным способом.</p>

      <div class="contacts-page__grid">

        <!-- Рязань -->
        <div class="contacts-card">
          <div class="contacts-card__city-badge">Рязань</div>
          <h2 class="contacts-card__name">РК Тек — Рязань</h2>
          <ul class="contacts-card__list">
            <li class="contacts-card__item">
              <span class="material-symbols-rounded contacts-card__icon">location_on</span>
              <a href="https://yandex.ru/maps/-/CDVKz6YB" target="_blank" rel="noopener" class="contacts-card__link">
                ул. Кольцова, дом 12
              </a>
            </li>
            <li class="contacts-card__item">
              <span class="material-symbols-rounded contacts-card__icon">call</span>
              <div class="contacts-card__phones">
                <a href="tel:+79105033237" class="contacts-card__link">+7 (910) 503-32-37</a>
              </div>
            </li>
            <li class="contacts-card__item">
              <span class="material-symbols-rounded contacts-card__icon">mail</span>
              <a href="mailto:info@рк-тек.рф" class="contacts-card__link">info@рк-тек.рф</a>
            </li>
          </ul>
          <div class="contacts-card__socials">
            <a href="https://t.me/Rktech_shop" target="_blank" rel="noopener" class="contacts-card__social contacts-card__social--tg">
              <span class="contacts-card__social-ico contacts-card__social-ico--tg" />
              Telegram
            </a>
            <a href="https://wa.me/79105033237" target="_blank" rel="noopener" class="contacts-card__social contacts-card__social--wa">
              <span class="contacts-card__social-ico contacts-card__social-ico--wa" />
              WhatsApp
            </a>
            <a href="https://max.ru/u/f9LHodD0cOK_iHS0MiYJ__OpgmQLWYCT56oHzFk16n3_xjIBH0GuGM9m-N0" target="_blank" rel="noopener" class="contacts-card__social contacts-card__social--max">
              <span class="contacts-card__social-ico contacts-card__social-ico--max" />
              MAX
            </a>
          </div>
          <a href="https://yandex.ru/maps/-/CDVKz6YB" target="_blank" rel="noopener" class="contacts-card__map-btn">
            <span class="material-symbols-rounded">map</span>
            Открыть на карте
          </a>
        </div>

        <!-- Москва -->
        <div class="contacts-card">
          <div class="contacts-card__city-badge contacts-card__city-badge--moscow">Москва</div>
          <h2 class="contacts-card__name">РК Тек — Москва</h2>
          <ul class="contacts-card__list">
            <li class="contacts-card__item">
              <span class="material-symbols-rounded contacts-card__icon">location_on</span>
              <a href="https://yandex.ru/maps/org/225229871067" target="_blank" rel="noopener" class="contacts-card__link">
                Багратионовский проезд, 7к2
              </a>
            </li>
            <li class="contacts-card__item">
              <span class="material-symbols-rounded contacts-card__icon">call</span>
              <div class="contacts-card__phones">
                <a href="tel:+79105033237" class="contacts-card__link">+7 (910) 503-32-37</a>
              </div>
            </li>
            <li class="contacts-card__item">
              <span class="material-symbols-rounded contacts-card__icon">mail</span>
              <a href="mailto:info@рк-тек.рф" class="contacts-card__link">info@рк-тек.рф</a>
            </li>
          </ul>
          <div class="contacts-card__notice">
            <span class="material-symbols-rounded">info</span>
            Самовывоз из Москвы — только по предварительному заказу после подтверждения менеджером
          </div>
          <div class="contacts-card__socials">
            <a href="https://t.me/Rktech_shop" target="_blank" rel="noopener" class="contacts-card__social contacts-card__social--tg">
              <span class="contacts-card__social-ico contacts-card__social-ico--tg" />
              Telegram
            </a>
            <a href="https://max.ru/u/f9LHodD0cOK_iHS0MiYJ__OpgmQLWYCT56oHzFk16n3_xjIBH0GuGM9m-N0" target="_blank" rel="noopener" class="contacts-card__social contacts-card__social--max">
              <span class="contacts-card__social-ico contacts-card__social-ico--max" />
              MAX
            </a>
          </div>
          <a href="https://yandex.ru/maps/org/225229871067" target="_blank" rel="noopener" class="contacts-card__map-btn">
            <span class="material-symbols-rounded">map</span>
            Открыть на карте
          </a>
        </div>

      </div>


    </div>
  </div>
</template>

<script setup>
const siteUrl = 'https://рк-тек.рф';
const pageUrl = `${siteUrl}/contacts`;
const pageTitle = 'Контакты — РК Тек в Рязани и Москве';
const pageDescription = 'Контакты магазина РК Тек: Рязань, ул. Кольцова, 12 и Москва, Багратионовский проезд, 7к2. Телефоны: +7 (910) 503-32-37. Telegram, WhatsApp, MAX.';
const ogImage = `${siteUrl}/images/mainPageBackground.webp`;

// eslint-disable-next-line no-undef
useHead({
  title: pageTitle,
  link: [{ rel: 'canonical', href: pageUrl }],
  meta: [
    { name: 'description', content: pageDescription },
    { name: 'keywords', content: 'рк тек контакты, рк тек рязань адрес, рк тек москва адрес, телефон рк тек, магазин apple рязань контакты' },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'ru_RU' },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:image', content: ogImage },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:url', content: pageUrl },
    { property: 'og:site_name', content: 'РК-Тек' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: pageTitle },
    { name: 'twitter:description', content: pageDescription },
    { name: 'twitter:image', content: ogImage },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Главная', item: siteUrl },
              { '@type': 'ListItem', position: 2, name: 'Контакты', item: pageUrl },
            ],
          },
          {
            '@type': ['Store', 'LocalBusiness'],
            name: 'РК Тек — Рязань',
            url: siteUrl,
            telephone: ['+79105033237'],
            email: 'info@рк-тек.рф',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'ул. Кольцова, дом 12',
              addressLocality: 'Рязань',
              addressCountry: 'RU',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '5.0',
              ratingCount: '100',
              reviewCount: '77',
              bestRating: '5',
              worstRating: '1',
            },
            sameAs: [
              'https://t.me/Rktech_shop',
              'https://wa.me/79105033237',
              'https://max.ru/u/f9LHodD0cOK_iHS0MiYJ__OpgmQLWYCT56oHzFk16n3_xjIBH0GuGM9m-N0',
              'https://yandex.ru/maps/-/CDVKz6YB',
            ],
          },
          {
            '@type': ['Store', 'LocalBusiness'],
            name: 'РК Тек — Москва',
            url: siteUrl,
            telephone: ['+79105033237'],
            email: 'info@рк-тек.рф',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Багратионовский проезд, 7к2',
              addressLocality: 'Москва',
              addressCountry: 'RU',
            },
            sameAs: [
              'https://t.me/Rktech_shop',
              'https://max.ru/u/f9LHodD0cOK_iHS0MiYJ__OpgmQLWYCT56oHzFk16n3_xjIBH0GuGM9m-N0',
              'https://yandex.ru/maps/org/225229871067',
            ],
          },
        ],
      }),
    },
  ],
});
</script>

<style scoped lang="scss">
.contacts-page {
  margin-top: 100px;
  padding: 40px 20px 80px;
  box-sizing: border-box;

  &__inner {
    max-width: 1000px;
    margin: 0 auto;
  }

  &__breadcrumbs {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  &__crumb {
    font-size: 13px;
    color: #888;
    text-decoration: none;
    &:hover { color: #333; }
    &--current { color: #333; }
  }

  &__sep {
    font-size: 13px;
    color: #bbb;
  }

  &__title {
    font-size: 36px;
    font-weight: 700;
    color: #1d1d1d;
    margin: 0 0 10px;

    @media (max-width: 600px) { font-size: 28px; }
  }

  &__subtitle {
    font-size: 16px;
    color: #666;
    margin: 0 0 40px;
    line-height: 1.6;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-bottom: 32px;

    @media (max-width: 720px) {
      grid-template-columns: 1fr;
    }
  }

  &__online {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 32px 36px;
    background: linear-gradient(135deg, #f5f5f7 0%, #ebebed 100%);
    border-radius: 20px;
    margin-top: 8px;

    @media (max-width: 720px) {
      flex-direction: column;
      align-items: flex-start;
      padding: 24px 20px;
    }
  }

  &__online-title {
    font-size: 22px;
    font-weight: 600;
    color: #1d1d1d;
    margin: 0 0 8px;
  }

  &__online-desc {
    font-size: 15px;
    color: #555;
    margin: 0;
    line-height: 1.6;
    max-width: 500px;
  }

  &__online-btns {
    display: flex;
    gap: 12px;
    flex-shrink: 0;

    @media (max-width: 500px) {
      flex-direction: column;
      width: 100%;
    }
  }

  &__btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 20px;
    border-radius: 14px;
    font-size: 15px;
    font-weight: 500;
    text-decoration: none;
    transition: opacity 0.18s;
    white-space: nowrap;

    &:hover { opacity: 0.85; }

    &--tg { background: #29a8eb; color: #fff; }
    &--wa { background: #25d366; color: #fff; }
  }
}

.contacts-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 28px;
  border: 1px solid #e8e8e8;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.09);
  }

  &__city-badge {
    display: inline-flex;
    align-items: center;
    width: fit-content;
    padding: 4px 12px;
    background: #1d1d1d;
    color: #fff;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;

    &--moscow {
      background: #0071e3;
    }
  }

  &__name {
    font-size: 20px;
    font-weight: 600;
    color: #1d1d1d;
    margin: 0;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  &__icon {
    font-size: 20px;
    color: #888;
    flex-shrink: 0;
    margin-top: 1px;
  }

  &__phones {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__link {
    font-size: 15px;
    color: #1d1d1d;
    text-decoration: none;
    line-height: 1.4;

    &:hover { color: #0071e3; text-decoration: underline; }
  }

  &__notice {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 12px 14px;
    background: #fff8e1;
    border-radius: 12px;
    font-size: 13px;
    color: #7a5900;
    line-height: 1.5;

    .material-symbols-rounded {
      font-size: 18px;
      flex-shrink: 0;
      margin-top: 1px;
      color: #f0a500;
    }
  }

  &__socials {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  &__social {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    transition: opacity 0.18s;

    &:hover { opacity: 0.8; }
    &--tg { background: #e8f5fe; color: #29a8eb; }
    &--wa { background: #e6faf0; color: #1da851; }
    &--max { background: #f3f4f6; color: #3b3b3b; }
  }

  &__social-ico {
    width: 20px;
    height: 20px;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    flex-shrink: 0;

    &--tg { background-image: url(/icons/telegram.svg); }
    &--wa { background-image: url(/icons/whatsapp.svg); }
    &--max { background-image: url(/icons/MAX.svg); }
  }

  &__map-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    border: 1.5px solid #e0e0e0;
    border-radius: 14px;
    font-size: 15px;
    font-weight: 500;
    color: #333;
    text-decoration: none;
    transition: border-color 0.18s, background 0.18s;
    margin-top: auto;

    .material-symbols-rounded { font-size: 20px; }

    &:hover {
      border-color: #0071e3;
      color: #0071e3;
      background: #f0f7ff;
    }
  }
}
</style>
