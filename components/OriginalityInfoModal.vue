<template>
      <ClientOnly>
    <el-dialog
      title="Оригинальность и гарантия"
      v-model="isDeliveryModal"
      :fullscreen="isMobile"
      @close="$emit('close')"
    >
      <div class="info-modal">
        <section class="info-modal__section">
          <h3 class="info-modal__subtitle">Оригинальность</h3>
          <p>
            Мы продаём только новую и оригинальную технику Apple и Dyson. Вы можете сами
            убедиться в этом перед покупкой, проверив устройство по серийному номеру на
            официальных сайтах компаний.
          </p>
        </section>

        <section class="info-modal__section">
          <h3 class="info-modal__subtitle">Гарантия</h3>
          <p>
            Будем дружить и после покупки. Мы всегда готовы осуществить гарантийный ремонт
            вашего устройства, а также оказать содействие в обмене и возврате товара
            ненадлежащего качества. Главное условие — устройство не должно иметь следы
            механического, термического и электрического воздействия, а также должны
            отсутствовать следы несанкционированного ремонта.
          </p>
          <p>
            Гарантийный срок — 1 год с момента покупки распространяется на: всю технику Apple*,
            Dyson, смартфоны, планшеты, персональные компьютеры, игровые приставки,
            акустические системы, бытовую технику.
          </p>
          <p>
            *Гарантийный срок — 3 месяца с момента покупки распространяется на наушники компании
            Apple (AirPods 2, AirPods 3th Generation, AirPods Pro, AirPods Pro 2th Generation,
            AirPods Max).
          </p>
          <p>
            Гарантийный срок — 1 месяц с момента покупки распространяется на: все аксессуары,
            портативные аккумуляторы, сетевые зарядные устройства, предметы быта.
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
