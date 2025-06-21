<template>
  <div class="itemOrder">
    <div class="leftContainer">
      <img :src="order.images[0]" :alt="order.name" width="50" height="50" class="imgOrder" />
      <div class="infoContainer">
        <span class="nameOrder">{{ order.name }}</span>
        <span class="orderOptions">{{ tags }}</span>
        <span v-if="order.count > 1" class="quantity">Количество: {{ order.count }}</span>
      </div>
    </div>

    <div class="rightContainer">
      <span v-if="order.count > 1" class="pricePerUnit">
        {{ pricePerUnit }} ₽ × {{ order.count }}
      </span>
      <span class="priceOrder">{{ price }} <strong>₽</strong> </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useApi } from '~/stores/api';

const api = useApi();

const props = defineProps({
  order: Object,
});

const imageOrder = ref(null);
const orderPrice = ref(null);

const price = computed(() => new Intl.NumberFormat('ru').format(props.order.price));
const pricePerUnit = computed(() => {
  const unitPrice = props.order.price / (props.order.count || 1);
  return new Intl.NumberFormat('ru').format(unitPrice);
});
// eslint-disable-next-line valid-typeof
const tags = computed(() => props.order?.tags?.join(' '));

// eslint-disable-next-line no-undef
onMounted(() => {});
</script>
<style scoped lang="scss">
.itemOrder {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin: 10px 0;

  &:last-child {
    border-bottom: none;
  }
}

.leftContainer {
  display: flex;
  align-items: center;
}

.infoContainer {
  display: flex;
  flex-direction: column;
  font-size: 16px;
  font-weight: 300;
  color: #373737;
  gap: 2px;
}

.quantity {
  font-size: 14px;
  color: #666;
}

.rightContainer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  font-size: 14px;
  font-weight: 300;
  color: #373737;
  flex-shrink: 0;
  gap: 2px;
}

.pricePerUnit {
  font-size: 12px;
  color: #999;
}

.icoDelete {
  background-image: url(/icons/close.svg);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  width: 25px;
  height: 25px;
  cursor: pointer;
  opacity: 0.4;
  transition: 0.2s;

  &:hover {
    opacity: 1;
  }
}
</style>
