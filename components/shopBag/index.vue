<template>
  <Teleport to="body">
    <div class="background" @click.self="closeShopBag()">
      <div v-if="isEmptyShopBag" class="wrapper">
        <div class="close" @click.self="closeShopBag()" />
        <div class="shopBagContainer">
          <h3>Корзина</h3>
          <ShopBagOrders />
          <div class="allCost">
            <span class="name">Итого</span>
            <span class="allPrice"
              >{{ new Intl.NumberFormat('ru').format(api.orders.totalCost) }}
              <strong>₽</strong></span
            >
          </div>
        </div>
        <div class="orderContainer">
          <h3>Оформить заказ</h3>
          <div class="body">
            <div class="inputsContainer">
              <CustomInput :label="'ФИО*'" :placeholder="'Иванов Иван Иванович'" />
              <CustomInput :label="'Телефон*'" :placeholder="'+7 900 100-00-00'" />
            </div>
            <div class="radioContainer">
              <h3>Получение товара</h3>
              <div class="radioVariants">
                <CustomRadio
                  v-for="radio in radioVariants"
                  :key="radio.id"
                  :label="radio.name"
                  :id="radio.id"
                  :checked="currentSel === radio.id"
                  @change="onChangeRadio"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty">
        <h3>Тут одиноко..</h3>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
// eslint-disable-next-line import/no-extraneous-dependencies
import { ref } from 'vue';
import { useApi } from '~/stores/api';

const api = useApi();

const emit = defineEmits(['closeShopBag']);

const radioVariants = ref([
  { name: 'Самовывоз', id: 1 },
  { name: 'Доставка по Москве', id: 2 },
  { name: 'Доставка по России', id: 3 },
]);
const closeShopBag = () => {
  emit('closeShopBag');
};

const options = ref([
  { name: 'Самовывоз', info: '' },
  { name: 'Доставка по Москве', info: '' },
  { name: 'Доставка по России', info: '' },
]);

const isEmptyShopBag = ref(true);
const currentSel = ref(1);

const onChangeRadio = (val) => {
  currentSel.value = val;
};

// const orderPrice = () => {
//   let cost = null;
//   api.orders.map((el) => {
//     el.product.variants.forEach(({ optionsIds }, idx) => {
//       const isContains = optionsIds.every((optionId) => el.options.includes(optionId));
//       if (isContains) {
//         // eslint-disable-next-line prefer-destructuring
//         cost += el.product.variants[idx].optionsInfo.price;
//       }
//     });
//     return cost;
//   });
//   allPrice.value = cost;
// };

// eslint-disable-next-line no-undef
onMounted(() => {
  if (localStorage?.orders) {
    isEmptyShopBag.value = true;
    // orders.value = JSON.parse(localStorage?.orders);
    document.body.style.overflow = 'hidden';
    api.getTotalCost();
  } else isEmptyShopBag.value = false;
});
// eslint-disable-next-line no-undef
onUnmounted(() => {
  document.body.style.overflow = 'auto';
});
</script>

<style scoped lang="scss">
h3 {
  font-size: 20px;
}

h2 {
  font-size: 16px;
}
.background {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 20px;
  top: 0;
  z-index: 5;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.636);
  overflow-x: auto;
  @media (max-width: 500px) {
    padding: 0;
  }
}

.wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 40px;
  background-color: #fff;
  border: 1px solid #eee;
  box-shadow: 0 0 20px rgb(160, 160, 160);
  border-radius: 32px 32px 0 0;
  padding: 50px;
  width: 375px;
  @media (max-width: 500px) {
    width: 100%;
    height: 100%;
    border-radius: 0;
    padding: 30px;
    padding-top: 50px;
  }
  .close {
    background-image: url(~/public/icons/close.svg);
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
}
.orderContainer {
  position: relative;
  z-index: 6;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 20px;
  font-size: 30px;
  width: 100%;
  height: 500px;
  box-sizing: border-box;
}

.body {
  display: flex;
  flex-direction: column;
  gap: 22px;
  justify-content: space-between;
}

.inputsContainer {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  margin-right: 40px;
}

.radioContainer {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radioVariants {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btnOptionContainer {
  display: flex;
  gap: 10px;
}

.btnOption {
  display: flex;
  justify-content: center;
  padding: 10px;
  flex: 1;
  height: 100px;
  background-color: #fff;
  border: 1px solid #eee;
  box-shadow: 0 0 10px #eee;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    box-shadow: 0 0 10px rgb(167, 167, 167);
  }
}

.shopBagContainer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-height: 320px;
  box-sizing: border-box;
}

.allCost {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #eee;
  padding: 5px 0;
}

.empty {
  background-color: #fff;
  padding: 50px;
  box-shadow: 0 0 20px rgb(166, 166, 166);
  border-radius: 32px;
}
</style>
