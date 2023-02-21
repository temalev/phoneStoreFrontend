<template>
  <div class="itemOrder">
    <div class="leftContainer">
      <img :src="order.images[0]" :alt="order.name" width="50" height="50" class="imgOrder" />
      <div class="infoContainer">
        <span class="nameOrder">{{ order.name }}</span>
        <span class="orderOptions">{{ order.tags.join(' ') }}</span>
      </div>
    </div>

    <div class="rightContainer">
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
