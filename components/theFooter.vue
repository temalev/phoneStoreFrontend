<template>
  <div class="mainFooter">
    <div class="navContainer">
      <div class="linksContainer">
        <h3>Каталог</h3>
        <nav class="links" aria-label="Категории товаров">
          <NuxtLink
            v-for="link in mainCategories"
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
        <h3>Аксессуары и бренды</h3>
        <nav class="links" aria-label="Подкатегории и бренды">
          <NuxtLink
            v-for="link in accessoriesSubs"
            :key="link.link"
            :to="link.link"
            class="navLinkMobile"
          >
            {{ link.name }}
          </NuxtLink>
          <NuxtLink
            v-for="link in otherBrands"
            :key="link.link"
            :to="link.link"
            class="navLinkMobile"
          >
            {{ link.name }}
          </NuxtLink>
        </nav>
      </div>

      <div class="linksContainer">
        <h3>Покупателям</h3>
        <nav class="links" aria-label="Информация для покупателей">
          <NuxtLink to="/contacts" class="navLinkMobile">Контакты</NuxtLink>
          <button
            v-for="link in info"
            :key="link.name"
            class="navLinkMobile"
            type="button"
            @click="api.infoModal = link?.value;"
          >
            {{ link?.name }}
          </button>
        </nav>
      </div>

      <div class="linksContainer">
        <h3>Блог</h3>
        <nav class="links" aria-label="Статьи блога">
          <NuxtLink to="/blog" class="navLinkMobile">Все статьи</NuxtLink>
          <NuxtLink
            v-for="post in latestPosts"
            :key="post.slug"
            :to="`/blog/${post.slug}`"
            class="navLinkMobile"
          >
            {{ post.title }}
          </NuxtLink>
        </nav>
      </div>
    </div>

    <div class="linksContainer">
      <div class="rowLinks">
        <div class="d-flex-column gap-2">
        <span class="tel"><a href="tel:+79105033237">+7 (910) 503-32-37</a></span>
         </div>
        <div class="social">
          <a
            href="https://t.me/Rktech_shop"
            class="telegramIco"
            aria-label="Открыть чат в Telegram"
          >
            <span class="sr-only">Открыть чат в Telegram</span>
          </a>
          <a
            href="https://wa.me/79105033237"
            class="whatsappIco"
            aria-label="Открыть чат в WhatsApp"
          >
            <span class="sr-only">Открыть чат в WhatsApp</span>
          </a>
          <a
            href="https://max.ru/u/f9LHodD0cOK_iHS0MiYJ__OpgmQLWYCT56oHzFk16n3_xjIBH0GuGM9m-N0"
            class="maxIco"
            aria-label="Открыть MAX"
          >
            <span class="sr-only">Открыть MAX</span>
          </a>
        </div>
      </div>
      <span class="tel">
        <a
          target="_blank"
          href="https://yandex.ru/maps/org/225229871067"
        >
        Москва, Багратионовский проезд, 7к2
        </a></span>
        <!-- eslint-disable-next-line max-len -->
        <span class="capture">Внимание! Самовывоз из офиса в Москве осуществляется только по предварительному заказу после подтверждения менеджером наличия и актуальной стоимости товаров.</span>
      <span class="tel">
        <a
          target="_blank"
          href="https://yandex.ru/maps/-/CDVKz6YB"
        >
          Рязань, ул. Кольцова, дом 12
        </a>
      </span>
      <span class="email"
        >info@рк-тек.рф -
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
import { ref, computed } from 'vue';
import { useCategories } from '~/stores/categories';
import { useApi } from '~/stores/api';
import { blogPosts } from '~/data/blogPosts';

const categories = useCategories();
const api = useApi();

const info = ref([
  {
    id: 1,
    name: 'Оригинальность',
    value: 'ORIGINALITY',
  },
  {
    id: 2,
    name: 'Оплата',
    value: 'PAYMENT',
  },
  {
    id: 3,
    name: 'Доставка',
    value: 'DELIVERY',
  },
  {
    id: 4,
    name: 'Гарантия лучшей цены',
    value: 'BEST_PRICE',
  },
]);

const mainCategories = computed(() => categories.categories);

const accessoriesSubs = computed(() => {
  const accessories = categories.categories.find((c) => c.link === '/accessories');
  return accessories?.categories ?? [];
});

const otherBrands = ref([
  { name: 'Marshall', link: '/other/marshall' },
  { name: 'DJI', link: '/other/dji' },
  { name: 'Xiaomi', link: '/other/xiaomi' },
  { name: 'JBL', link: '/other/jbl' },
  { name: 'Dreame', link: '/other/dreame' },
]);

const latestPosts = computed(() => [...blogPosts]
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 4));

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
  justify-content: space-between;
  gap: 40px;
  width: 100%;
  background-color: #2c2c2c;
  box-shadow: inset 0 20px 30px rgb(34, 34, 34);
  margin-top: 50px;
  color: #fff;
  padding: 50px;
  box-sizing: border-box;

  @media (max-width: 1100px) {
    flex-direction: column;
    gap: 30px;
  }

  @media (max-width: 768px) {
    padding: 30px 20px;
  }
}

.navContainer {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 40px;
  flex: 1;
  min-width: 0;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 30px;
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px;
  color: #fff;
}

.links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.navLinkMobile {
  font-size: 14px;
  line-height: 1.4;
  color: #bdbdbd;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  text-align: left;
  text-decoration: none;
  transition: color 0.15s;

  &:hover {
    color: #fff;
  }
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

  @media (max-width: 480px) {
    flex-wrap: wrap;
    gap: 12px;
  }
}

.tel {
  color: #fff;
  font-size: 20px;
  a {
    color: #fff;
  }

  @media (max-width: 480px) {
    font-size: 17px;
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

  @media (max-width: 768px) {
    max-width: 100%;
    align-items: flex-start;
  }
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

.maxIco {
  background-image: url(/icons/MAX.svg);
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

.capture {
  max-width: 500px;
  font-size: 14px;
  color: #ccc;
  line-height: 1.4;

  @media (max-width: 768px) {
    max-width: 100%;
  }
}
</style>
