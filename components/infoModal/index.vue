<template>
  <div class="infoModal" @click.self="close">
    <div class="close" @click.self="close" />
    <div class="contents">
      <div v-for="(content, idContent) in info" :key="idContent" class="content">
        <h3 class="header">{{ content.header }}</h3>
        <div class="paragraphs">
          <p v-for="(paragraph, idP) in content?.paragraphs" :key="idP" class="paragraph">
            {{ paragraph.paragraph }}
          </p>
        </div>
      </div>
      <div class="content">
        <h3 class="header">Гарантия лучшей цены</h3>
        <div class="paragraphs">
          <p class="paragraph">
            «Гарантия лучшей цены» дает вам уверенность в том, что делаете покупку по самой выгодной
            цене.
          </p>
          <p class="paragraph">
            Если вы найдете аналогичный товар в другом магазине дешевле, чем на нашем сайте, то мы
            сделаем вам скидку от цены другого магазина или предложим подарки к заказу. Главное,
            чтобы этот магазин находился в вашем городе или имел возможность отправить вам товар
            транспортной компанией.
          </p>
          <p class="paragraph">
            Вы нашли аналогичный товар дешевле? Напишите нам в
            <a href="https://t.me/Rk_tech_support">телеграмм</a>, приложите ссылку или снимок
            экрана, на котором четко видна более низкая цена и соответствующие ей условия.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';

const info = ref([
  {
    header: 'Оригинальность',
    paragraphs: [
      {
        paragraph:
          'Мы продаем только новую и оригинальную технику Apple и Dyson. Вы можете сами убедиться в этом перед покупкой, проверив устройство по серийному номеру на официальных сайтах брендов.',
      },
    ],
  },
  {
    header: 'Оплата',
    paragraphs: [
      {
        paragraph: 'Оплачивайте той валютой, которая удобна вам.',
      },
    ],
  },
  {
    header: 'Доставка',
    paragraphs: [
      {
        paragraph:
          'Мы осуществляем курьерскую доставку до двери в Москве, Московской области и Рязани.',
      },
      {
        paragraph:
          'В другие регионы России доставка осуществляется с помощью транспортной компании «Сдэк» по 100% предоплате.',
      },
      {
        paragraph: 'Доставка заказов свыше 50.000₽ осуществляется бесплатно.',
      },
      {
        paragraph:
          'Стоимость курьерской доставки в Москве в пределах МКАД при заказе до 50.000₽ - 490 рублей. Оплата заказа наличными при получении.',
      },
      {
        paragraph:
          'Стоимость курьерской доставки за пределы МКАД при заказе до 50.000₽ - 490₽ + 50₽ каждый километр от МКАД. Оплата заказа наличными при получении.',
      },
      {
        paragraph:
          'Стоимость доставки в пределах г. Рязань при заказе до 50.000₽ - 390₽. Оплата заказа наличными при получении.',
      },
      {
        paragraph: 'Стоимость доставки в другие регионы России при заказе до 50.000₽ - 490 рублей.',
      },
    ],
  },
]);

const emits = defineEmits(['close']);

const close = () => {
  emits('close', true);
};

// eslint-disable-next-line no-undef
onMounted(() => {
  document.body.style.overflow = 'hidden';
});

// eslint-disable-next-line no-undef
onUnmounted(() => {
  document.body.style.overflow = '';
});
</script>
<style scoped lang="scss">
.infoModal {
  position: fixed;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  z-index: 99999;
  overflow: scroll;
  box-sizing: border-box;
  backdrop-filter: blur(3px);

  @media (max-width: 500px) {
    align-items: flex-start;
  }
}

.contents {
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 32px;
  background-color: #fff;
  box-shadow: 0 0 20px #8d8d8db7;
  border-radius: 22px;
  max-width: 800px;

  @media (max-width: 500px) {
    border-radius: 0;
  }
}

.content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.paragraphs {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 8px;
}

.close {
  background-image: url(/icons/close.svg);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: none;
  @media (max-width: 500px) {
    display: block;
  }
}
</style>
