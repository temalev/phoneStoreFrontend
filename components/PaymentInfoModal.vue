<template>
      <ClientOnly>
    <el-dialog
      title="Оплата"
      v-model="isDeliveryModal"
      :fullscreen="isMobile"
      @close="$emit('close')"
    >
      <div class="info-modal">
        <section class="info-modal__section">
          <h3 class="info-modal__subtitle">Способы оплаты</h3>
          <ul class="info-modal__list">
            <li>Наличными</li>
            <li>Программа Trade-In</li>
            <li>Безналичная оплата для юридических лиц<sup>*</sup></li>
            <li>Банковской картой<sup>*</sup></li>
            <li>Рассрочка<sup>*</sup></li>
            <li>
              Оплата в удобной для вас валюте $ | € | USDT
              (по актуальному на день покупки курсу)
            </li>
          </ul>
        </section>

        <section class="info-modal__section">
          <p>
            <sup>*</sup>Стоимость всех устройств в нашем магазине указана со скидкой только при
            оплате наличными. Скидка не учитывается при оплате банковской картой, оформлении
            рассрочки и при безналичной оплате для юридических лиц.
          </p>
          <p>
            <sup>*</sup>Перевод средств на банковскую карту в качестве оплаты не принимаем.
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
