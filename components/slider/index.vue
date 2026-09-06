<template>
  <div class="mainSliderContainer">
    <NuxtLink
      v-for="card in props.categories.categories"
      :key="card"
      :to="!isNoLink ? card.link : ''"
    >
      <div class="productLink" :style="{borderRadius: isMessageBlock ? '10px 10px 0 0' : '10px'}">
        <div class="header">{{ card.name }}</div>
        <img
          class="img"
          :src="card.img"
          :alt="`${card.name} — купить в Рязани в РК-Тек`"
          v-bind="imageSize(card.img)"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div v-if="isMessageBlock" class="message-block">
        <p>
          Мы всегда рады найти для вас нужный товар данного производителя по
          выгодной цене!<br /> <br>
          Свяжитесь с нами в мессенджерах, которые указаны внизу страницы.
        </p>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup>
import { useApi } from '~/stores/api';
import { imageSize } from '~/composables/useImageSize.ts';

const api = useApi();

const props = defineProps({
  categories: {
    type: Object,
    default: () => {},
  },
  isNoLink: {
    type: Boolean,
    default: false,
  },
  isMessageBlock: {
    type: Boolean,
    default: false,
  },
});

// eslint-disable-next-line no-undef
onMounted(() => {});
</script>

<style scoped lang="scss">
.mainSliderContainer {
  // ширина плитки нужна и карточке, и блоку-сообщению под ней — держим в одном месте,
  // иначе при следующей правке размера они разъедутся
  --tile-w: 260px;
  --tile-h: 300px;

  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 24px;
  overflow: scroll;
  scroll-behavior: smooth;
  padding: 20px 10px;
  flex-shrink: 0;
  width: inherit;

  @media (max-width: 500px) {
    scroll-snap-type: x mandatory;
    padding: 20px 100px;
    width: auto;
    justify-content: flex-start;
  flex-wrap: nowrap;
  }
  &::-webkit-scrollbar {
    display: none;
  }
  .productLink {
    width: var(--tile-w);
    height: var(--tile-h);
    flex-shrink: 0;
    overflow: hidden;
    padding-top: 32px;
    background-color: #fff;
    border: 1px solid #eee;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    transition: 0.2s;
    box-sizing: border-box;
    cursor: pointer;

    @media (max-width: 500px) {
      scroll-snap-align: center;
    }
    &:hover {
      box-shadow: 0 0 20px #c4c4c4;
    }
  }
}

.message-block {
  // margin-top: 10px;
  padding: 12px;
  background-color: #ffffff;
  border-top: 1px solid #eee;
  border-radius: 0 0 10px 10px;
  box-shadow: 0px 0px 10px 5px rgb(247, 247, 247);
  font-size: 11px;
  color: #353535;
  width: var(--tile-w);
  box-sizing: border-box;
  // box-shadow: inset 0 5px 10px 5px #dedede;
}

.header {
  font-family: Helvetica, Arial, sans-serif;
  font-weight: bold;
  font-size: 20px;
  color: #2c2c2c;
  text-align: center;
}
.img {
  // height: auto обязателен вместе с атрибутами width/height на теге: иначе флекс
  // берёт за базу собственную высоту файла (у iphone.webp это 628px), ужимает её
  // под 350px карточки, и object-fit растягивает картинку по неверной коробке.
  // contain вместо fill — страховка: если флекс всё же ужмёт, картинка не расплющится.
  object-fit: contain;
  width: 100%;
  height: auto;
  background-color: #fff;
}
</style>
