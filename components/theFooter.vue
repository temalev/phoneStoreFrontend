<template>
  <div class="mainFooter">
    <div class="navContainer">
      <div class="linksContainer">
        <h3>Навигация</h3>
        <nav class="links">
          <NuxtLink
            v-for="link in categories.categories"
            :key="link.name"
            :to="link.link"
            class="navLinkMobile"
            @click="getProduct(link.link)"
          >
            {{ link?.name }}
          </NuxtLink>
        </nav>
      </div>
      <div class="linksContainer">
        <h3>Информация</h3>
        <nav class="links" @click="api.isInfoModal = true">
          <NuxtLink
            v-for="link in info"
            :key="link.name"
            :to="link?.link"
            class="navLinkMobile"
            @click="getProduct(link?.link)"
          >
            {{ link?.name }}
          </NuxtLink>
        </nav>
      </div>
    </div>

    <div class="linksContainer">
      <div class="rowLinks">
        <span class="tel"><a href="tel:+79801062064">+7 (980) 106-20-64</a></span>
        <div class="social">
          <a href="https://t.me/RK_TECH01" class="telegramIco" />
          <a href="https://wa.me/79801062064" class="whatsappIco" />
        </div>
      </div>
      <span class="tel">
        <a
          target="_blank"
          href="https://yandex.ru/maps/213/moscow/house/ulitsa_barklaya_8/Z04YcwdiTkYFQFtvfXt1cH1mYg==/?ll=37.502732%2C55.741156&utm_source=main_stripe_big&z=17"
        >
        Москва, ул. Барклая, дом 8
        </a></span>
      <span class="tel">
        <a
          target="_blank"
          href="https://yandex.ru/maps/11/ryazan/house/ulitsa_koltsova_1/Z0AYcQRlSk0AQFtufXpzeHtkZw==/?ll=39.735386%2C54.629774&utm_source=main_stripe_big&z=17"
        >
          Рязань, ул. Кольцова, дом 1
        </a>
      </span>
      <span class="email"
        >info@rk-tech.shop -
        <span> По вопросам сотрудничества, идеям по улучшению и жалобам. </span></span
      >
      <div class="oferta">
        <p>
          Сайт носит исключительно информационный характер и не является публичной офертой,
          определяемой Статьей 437 (1) ГК РФ.
        </p>
        <p>
          Apple и логотип Apple являются зарегистрированными товарными знаками компании Apple Inc. в
          США и других странах. App Store является знаком обслуживания компании Apple Inc.
        </p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useCategories } from '~/stores/categories';
import { useApi } from '~/stores/api';

const categories = useCategories();
const api = useApi();

const info = ref([
  {
    id: 1,
    name: 'Оригинальность',
  },
  {
    id: 2,
    name: 'Оплата',
  },
  {
    id: 3,
    name: 'Доставка',
  },
  {
    id: 3,
    name: 'Гарантия лучшей цены',
  },
]);

const getProduct = (link) => {
  const uuidSelectCategory = categories.categories.find((el) => el.link === link)?.uuid;
  if (uuidSelectCategory) {
    api.getProducts(uuidSelectCategory);
  }
};
</script>
<style scoped lang="scss">
.mainFooter {
  display: flex;
  justify-content: space-around;
  width: 100%;
  background-color: #2c2c2c;
  box-shadow: inset 0 20px 30px rgb(34, 34, 34);
  margin-top: 50px;
  color: #fff;
  padding: 50px;
  box-sizing: border-box;

  @media (max-width: 500px) {
    flex-direction: column;
    gap: 20px;
  }
}

.navContainer {
  display: flex;
  gap: 50px;
}

.links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.navLinkMobile {
  font-size: 16px;
  color: #fff;
  cursor: pointer;
}

.linksContainer {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.rowLinks {
  display: flex;
  align-items: center;
  gap: 20px;
}

.tel {
  color: #fff;
  font-size: 20px;
  a {
    color: #fff;
  }
}

.social {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

.oferta {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  max-width: 500px;
  color: #ffffff63;
  font-size: 13px;
  font-weight: 300;
}

.telegramIco {
  background-image: url(/icons/telegram.svg);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  width: 30px;
  height: 30px;
  display: block;
}

.whatsappIco {
  background-image: url(/icons/whatsapp.svg);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  width: 25px;
  height: 25px;
  display: block;
}

.email {
  font-size: 18px;
  span {
    font-weight: 300;
    font-size: 15px;
  }
}
</style>
