<!-- eslint-disable max-len -->
<template>
  <div class="body">
    <div class="welcome">
      <div class="text">
        <h1>РК Тек</h1>
        <p>Высокий уровень сервиса и доступные цены.</p>
      </div>
    </div>
    <Slider :categories="categories" />
    <InfoContainers @openModal="onOpenModal" />
    <div class="reviews-section">
      <div class="reviews-header">
        <h2 class="reviews-title">Отзывы покупателей</h2>
        <p class="reviews-subtitle">Мы верим, что довольный клиент — лучшая оценка нашей работы. <br>
          Каждый заказ собирается с вниманием к деталям:
          только оригинальная техника, честные цены и поддержка на каждом шаге. <br>
          Именно поэтому нам доверяют — и возвращаются снова.</p>
        <p class="reviews-subtitle">
          За каждым отзывом — реальный опыт покупателя. Вот что чаще всего отмечают наши клиенты.
        </p>
        <ul class="reviews-points">
          <li class="reviews-point">
            <div class="reviews-point__icon">
              <span class="material-symbols-rounded">sell</span>
            </div>
            <div class="reviews-point__content">
              <span class="reviews-point__title">Самые низкие цены</span>
              <span class="reviews-point__desc">«Лучшая цена в городе» — это упоминают практически в каждом отзыве</span>
            </div>
          </li>
          <li class="reviews-point">
            <div class="reviews-point__icon">
              <span class="material-symbols-rounded">redeem</span>
            </div>
            <div class="reviews-point__content">
              <span class="reviews-point__title">Подарки при покупке</span>
              <span class="reviews-point__desc">Чехол, защитное стекло, адаптер — дарим при каждом заказе</span>
            </div>
          </li>
          <li class="reviews-point">
            <div class="reviews-point__icon">
              <span class="material-symbols-rounded">phone_iphone</span>
            </div>
            <div class="reviews-point__content">
              <span class="reviews-point__title">Перенос данных и настройка</span>
              <span class="reviews-point__desc">Перенесём контакты, фото и установим нужные приложения бесплатно</span>
            </div>
          </li>
          <li class="reviews-point">
            <div class="reviews-point__icon">
              <span class="material-symbols-rounded">bolt</span>
            </div>
            <div class="reviews-point__content">
              <span class="reviews-point__title">Быстрая доставка</span>
              <span class="reviews-point__desc">Доставляем в день заказа — иногда уже через час</span>
            </div>
          </li>
          <li class="reviews-point">
            <div class="reviews-point__icon">
              <span class="material-symbols-rounded">support_agent</span>
            </div>
            <div class="reviews-point__content">
              <span class="reviews-point__title">Внимательный сервис</span>
              <span class="reviews-point__desc">Помогаем с выбором, консультируем и отвечаем на любые вопросы</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="reviews-iframe-wrapper">
        <iframe
          src="https://yandex.ru/maps-reviews-widget/151523832840?comments"
          class="reviews-iframe"
          frameborder="0"
        />
        <a
          href="https://yandex.com/maps/org/rk_tech/151523832840/"
          target="_blank"
          class="reviews-link"
        >РК Тек на Яндекс Картах</a>
      </div>
    </div>
    <DeliveryInfoModal v-if="api.infoModal === 'DELIVERY'" @close="api.infoModal = null" />
    <PaymentInfoModal v-if="api.infoModal === 'PAYMENT'" @close="api.infoModal = null" />
    <OriginalityInfoModal v-if="api.infoModal === 'ORIGINALITY'" @close="api.infoModal = null" />
    <Teleport
      v-if="api.infoModal && api.infoModal !== 'DELIVERY' && api.infoModal !== 'PAYMENT' && api.infoModal !== 'ORIGINALITY'"
      to="body">
      <InfoModal @close="api.infoModal = null" />
    </Teleport>
  </div>
</template>

<script setup>
import { useCategories } from '~/stores/categories';
import { useApi } from '~~/stores/api';

const api = useApi();
const categories = useCategories();

const pageUrl = 'https://рк-тек.рф';
const pageTitle = 'РК Тек — интернет-магазин техники Apple и Dyson в Москве';
const pageDescription = 'РК Тек — техника и аксессуары Apple и Dyson в Москве по низким ценам. iPhone, iPad, Mac, AirPods, Apple Watch. Гарантия 1 год. Доставка по Москве в день заказа.';
const ogImage = '/images/mainPageBackground.webp';

// eslint-disable-next-line no-undef
useHead({
  title: pageTitle,
  link: [{ rel: 'canonical', href: pageUrl }],
  meta: [
    { name: 'description', content: pageDescription },
    { name: 'keywords', content: 'купить iPhone Москва, купить iPad, Apple Watch купить, AirPods купить, Dyson купить, Mac купить, интернет магазин Apple Москва, RK Tech' },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:image', content: ogImage },
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
        '@type': 'Store',
        name: 'РК Тек',
        url: pageUrl,
        description: pageDescription,
        logo: `${pageUrl}/icons/logo.svg`,
        image: `${pageUrl}${ogImage}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Москва',
          addressCountry: 'RU',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          url: 'https://t.me/Rktech_shop',
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Техника Apple и Dyson',
          itemListElement: categories.categories.map((cat) => ({
            '@type': 'OfferCatalog',
            name: cat.name,
            url: `${pageUrl}${cat.link}`,
          })),
        },
      }),
    },
  ],
});

const onOpenModal = (modal) => {
  api.infoModal = modal;
};
</script>

<style scoped lang="scss">
.body {
  display: flex;
  flex-direction: column;
  gap: 50px;

  @media (max-width: 850px) {
    gap: 26px;
  }
}

h1 {
  font-size: 52px;
}

.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  justify-content: center;
  position: relative;
  margin-top: 70px;
  background-image: url(/images/mainPageBackground.webp);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 60vh;
  box-shadow: inset 2px 0 10px rgb(144, 144, 144);
  flex-shrink: 0;

  @media (max-width: 850px) {
    height: 40vh;
  }
}

.text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  justify-content: center;
  margin-top: -45px;
}

.reviews-section {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 48px;
  margin: 0 80px;
  padding: 48px;
  border: 1px solid #eee;
  border-radius: 22px;

  @media (max-width: 1000px) {
    flex-direction: column;
    margin: 0 20px;
    padding: 32px 20px;
    gap: 24px;
  }
}

.reviews-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.reviews-title {
  font-size: 32px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;

  @media (max-width: 850px) {
    font-size: 24px;
  }
}

.reviews-subtitle {
  font-size: 16px;
  color: #6b6b6b;
  margin: 0;
  line-height: 1.7;
}

.reviews-points {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0;
  margin: 4px 0 0;
  list-style: none;
}

.reviews-point {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 16px;
  background-color: #fff;
  border-radius: 14px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  }
}

.reviews-point__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background-color: #f0f0f0;
  flex-shrink: 0;
  color: #2c2c2c;

  .material-symbols-rounded {
    font-size: 22px;
    font-variation-settings: 'FILL' 1, 'wght' 500;
  }
}

.reviews-point__content {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.reviews-point__title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
}

.reviews-point__desc {
  font-size: 13px;
  color: #6b6b6b;
  line-height: 1.5;
}

.reviews-iframe-wrapper {
  position: relative;
  width: 560px;
  height: 100%;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  @media (max-width: 1000px) {
    width: 100%;
    height: 600px;
  }
}

.reviews-iframe {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 16px;
  box-sizing: border-box;
}

.reviews-link {
  box-sizing: border-box;
  text-decoration: none;
  color: #b3b3b3;
  font-size: 10px;
  font-family: YS Text, sans-serif;
  position: absolute;
  bottom: 8px;
  left: 0;
  width: 100%;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  max-height: 14px;
  white-space: nowrap;
  padding: 0 16px;
}
</style>
