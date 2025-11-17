<template>
      <ClientOnly>
    <el-dialog
      title="Доставка и самовывоз"
      v-model="isDeliveryModal"
      :fullscreen="isMobile"
      @close="$emit('close')"
    >
      <div class="info-modal">
        <section class="info-modal__section">
          <h3 class="info-modal__subtitle">Самовывоз в г. Москва</h3>
          <p>
            Осуществляется по адресу: <a target="_blank" href="https://yandex.ru/maps/org/225229871067">Багратионовский проезд, 7, корп. 2.</a>
          </p>
          <p>
            Самовывоз возможен только после оформления заказа, подтверждения наличия менеджером
            и согласования даты и времени.
          </p>
        </section>

        <section class="info-modal__section">
          <h3 class="info-modal__subtitle">Самовывоз в г. Рязань</h3>
          <p>
            Осуществляется по адресу: <a target="_blank" href="https://yandex.ru/maps/-/CDVKz6YB">ул. Кольцова, д. 1, вход на 1 этаж напротив банка
            «Русский стандарт».</a>
          </p>
          <p>Режим работы: пн - пт — 10:00-23:00, сб - вс — 11:00-23:00.</p>
        </section>

        <section class="info-modal__section">
          <h3 class="info-modal__subtitle">Курьерская доставка</h3>
          <p>
            Мы осуществляем курьерскую доставку по Москве и МО, Рязани, а также в Санкт‑Петербург.
            Оплата курьеру при получении заказа.
          </p>
          <p>
            В другие регионы России доставка осуществляется транспортной компанией «СДЭК»
            по полной предоплате.
          </p>
        </section>

        <section class="info-modal__section">
          <h3 class="info-modal__subtitle">Стоимость доставки, г. Москва</h3>
          <ul class="info-modal__list">
            <li>Доставка по Москве внутри МКАД на следующий день после заказа — от 700 ₽.</li>
            <li>Срочная доставка в день заказа внутри МКАД — от 1 000 ₽.</li>
            <li>Доставка за МКАД рассчитывается отдельно.</li>
          </ul>
        </section>

        <section class="info-modal__section">
          <h3 class="info-modal__subtitle">Стоимость доставки, г. Санкт‑Петербург</h3>
          <ul class="info-modal__list">
            <li>
              От 1 500 ₽, доставка на следующий день до двери в пределах Петербурга,
              если заказ оформлен до 12:00 текущего дня. Оплата курьеру при получении.
            </li>
          </ul>
        </section>

        <section class="info-modal__section">
          <h3 class="info-modal__subtitle">Стоимость доставки, г. Рязань</h3>
          <ul class="info-modal__list">
            <li>500 ₽, если адрес находится в черте города.</li>
          </ul>
          <p>Стоимость и возможность доставки за пределы города уточняются отдельно.</p>
        </section>

        <section class="info-modal__section">
          <h3 class="info-modal__subtitle">
            Доставка в другие регионы РФ транспортной компанией «СДЭК»
          </h3>
          <ul class="info-modal__list">
            <li>От 500 ₽ в зависимости от удалённости региона от Москвы и габаритов отправки.</li>
          </ul>
          <p>
            Мы надёжно упакуем ваш заказ в воздушно‑пупырчатую плёнку и коробку,
            сделаем фото содержимого посылки в пункте отправки,
            а также направим трек‑номер для отслеживания.
          </p>
        </section>

        <section class="info-modal__section">
          <p>
            Оформляйте покупку на сайте — менеджер свяжется с вами для подтверждения заказа
            и уточнения деталей по доставке.
          </p>
        </section>
      </div>
    </el-dialog>
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isDeliveryModal = ref(true);
const isMobile = ref(false);

onMounted(() => {
  if (window.innerWidth <= 768) {
    isMobile.value = true;
  }
});
</script>

<style scoped lang="scss">
.info-modal {
  font-size: 14px;
  line-height: 1.5;
  color: #2c2c2c;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: auto;
}

.info-modal__section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-modal__subtitle {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px;
}

.info-modal__list {
  padding-left: 18px;
  margin: 0;
}

.info-modal__list li {
  margin-bottom: 4px;
  list-style: disc;
}

</style>
