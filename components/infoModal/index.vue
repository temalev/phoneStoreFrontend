<template>
  <div class="infoModal" @click.self="close">
    <div class="close" @click.self="close" />
    <div class="contents">
      <div class="content">
        <h3 class="header">Рассрочка</h3>
        <div class="paragraphs">
          <p class="paragraph">
            В наших магазинах вы можете приобрести все устройства техники Apple и Dyson в рассрочку по самым выгодным условиям без первоначального взноса.
          </p>
          <ul>
            <li>&bull; От 18 лет</li>
            <li>&bull; Срок от 3 до 24 месяцев</li>
            <li>&bull; Наличие паспорта РФ и номера телефона</li>
          </ul>
          <p class="paragraph">
            По вопросам и оформлению онлайн - <a href="https://t.me/Rk_tech_support">аккаунт поддержки</a> в Telegram
          </p>
        </div>
      </div>

      <div class="content">
        <h3 class="header">Программа Trade-In.</h3>
        <div class="paragraphs">
          <p class="paragraph">
            Trade-In - это осознанный и выгодный способ покупки нового устройства.
          </p>
          <ul>
            <li><b>1.</b> Мы принимаем <b>все</b> модели iPhone, iPad, Apple Watch, MacBook. Устройство должно быть в рабочем состоянии (включаться), без следов контакта с жидкостью, а также не должны присутствовать следы несанкционированного ремонта.</li>
            <li><b>2.</b> Если ваше устройство подходит под данные условия, мы проведем диагностику для оценки его стоимости и сообщим сумму выкупа, которую вы сможете использовать в качестве скидки на покупку <b>любого</b> товара из ассортимента. Вы можете сдать по программе Trade-In не одно устройство, а несколько. В этом случае будет учитываться суммарная сумма выкупа в качестве скидки.</li>
            <li><b>3.</b> Вы можете оплатить новое устройство наличными, а также оформить недостающую сумму в рассрочку.</li>
          </ul>
        </div>
      </div>

      <div class="content">
        <h3 class="header">Продажа устройств, бывших в употреблении.</h3>
        <div class="paragraphs">
          <p class="paragraph">
            Зачастую многие относятся к покупке поддержанных гаджетов скептически, потому что покупатель не может в полной мере оценить работоспособность телефона/ноутбука/часов визуально. 
          </p>
          <p class="paragraph">
            Покупая Б/У устройство в RK TECH, вы можете быть уверены в том, что:
          </p>
          <ul>
            <li>&bull; Перед продажей была проведена всесторонняя диагностика устройства;</li>
            <li>&bull; Вы приобретате телефон/ноутбук/часы полностью в рабочем состоянии;</li>
            <li>&bull; Устройство содержит исключительно точное описание его состояния;</li>
            <li>&bull; Вы экономите не только свои деньги, но и нервы, ведь мы предоставляем гарантию на данную продукцию, которая действует в течение 3 месяцев после покупки;</li>
            <li>&bull; Все прозрачно: если вы не до конца убеждены в работоспособности устройства, вы можете проверить его самостоятельно.</li>
          </ul>
        </div>
      </div>

      <div class="content">
        <h3 class="header">Способы оплаты</h3>
        <div class="paragraphs">
          <ul>
            <li>&bull; Наличными;</li>
            <li>&bull; Программа Trade-In;</li>
            <li>&bull; Безналичная оплата для юридических лиц<sup>*</sup>;</li>
            <li>&bull; Банковской картой<sup>*</sup>;</li>
            <li>&bull; Рассрочка<sup>*</sup>;</li>
            <li>&bull; Оплата в удобной для вас валюте $|€|USDT (по актуальному на день покупки курсу).</li>
          </ul>
          <p class="paragraph">
            <sup>*</sup>Стоимость всех устройств в нашем магазине указана со скидкой только при оплате наличными. Скидка не учитывается при оплате банковской картой, оформлении рассрочки и при безналичной оплате для юридических лиц.
          </p>
          <p class="paragraph">
            <sup>*</sup>Перевод средств на банковскую карту в качестве оплаты не принимаем.
          </p>
        </div>
      </div>

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
            <a href="https://t.me/Rk_tech_support">телеграм</a>, приложите ссылку или снимок
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
          'Мы продаем только новую и оригинальную технику Apple и Dyson. Вы можете сами убедиться в этом перед покупкой, проверив устройство по серийному номеру на официальных сайтах компаний.',
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
