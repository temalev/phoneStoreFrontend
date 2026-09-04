<template>
  <Teleport to="body">
    <div
      class="background"
      :style="{
        alignItems: isApprovedOrder || !isEmptyShopBag ? 'center' : '',
      }"
      @click.self="closeShopBag()"
    >
      <Transition>
        <div v-if="isEmptyShopBag && !isApprovedOrder" class="wrapper">
          <button
            type="button"
            class="close"
            aria-label="Закрыть корзину"
            @click="closeShopBag()"
          />
          <div class="shopBagContainer">
            <div class="shopBagHead">
              <h3>Корзина</h3>
              <span class="itemsCount">{{ itemsCountLabel }}</span>
            </div>
            <ShopBagOrders />
            <div class="allCost">
              <span class="name">Итого</span>
              <div class="allPrice">
                <span
                  :style="{
                    textDecoration: aprovedPromocode?.discount
                      ? 'line-through'
                      : '',
                  }"
                  class="price"
                  >{{
                    new Intl.NumberFormat("ru").format(api.orders.totalCost)
                  }}</span
                >
                <strong class="pl-1">₽</strong>
                <div v-if="aprovedPromocode?.discount" class="discount">
                  {{
                    new Intl.NumberFormat("ru").format(
                      api.orders.totalCost - aprovedPromocode?.discount
                    )
                  }}
                  <strong>₽</strong>
                </div>
              </div>
            </div>
          </div>
          <div class="orderContainer">
            <h3 v-if="api.orders.totalCost === 0">Оформить предзаказ</h3>
            <h3 v-else>Оформить заказ</h3>
            <div class="body">
              <div class="inputsContainer">
                <Input
                  :label="'Фамилия Имя*'"
                  :placeholder="'Иванов Иван Иванович'"
                  @inputValue="(val) => (userData.name = val)"
                />

                <RussianPhoneNumberInput
                  :label="'Телефон*'"
                  @inputValue="(val) => (userData.tel = val)"
                />
              </div>
              <div class="radioContainer">
                <h3>Получение товара</h3>
                <div class="radioVariants">
                  <div
                    class="variant"
                    :class="{ 'variant--active': currentSel === radio.id }"
                    v-for="radio in radioVariants"
                    :key="radio.id"
                    @click="currentSel = radio.id"
                  >
                    <div class="rowVariant">
                      <el-radio v-model="currentSel" :label="radio.id">{{
                        radio.name
                      }}</el-radio>
                      <el-tooltip
                        v-if="radio.info"
                        :content="radio?.info"
                        placement="top"
                      >
                        <div class="icoQuestion"></div>
                      </el-tooltip>
                    </div>
                    <CustomTextarea
                      v-if="
                        (currentSel === 2 ||
                          currentSel === 3 ||
                          currentSel === 5 ||
                          currentSel === 6) &&
                        currentSel === radio.id
                      "
                      label="Адрес доставки"
                      @inputValue="(val) => (userData.address = val)"
                    />
                  </div>
                </div>
              </div>
              <div class="d-flex-column">

              <h3>Способ оплаты</h3>
              <el-select
                v-model="selectedPaymentType"
                class="mt-2"
                placeholder="Select"
              >
                <el-option
                  v-for="item in paymentTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </div>
              <div v-if="!aprovedPromocode" class="d-flex-column">
                <div class="d-flex align-flex-end gap-4">
                  <Input
                    label="Промокод"
                    placeholder="Введите промокод"
                    @inputValue="(val) => (promocodeName = val)"
                  />
                  <CustomButton
                    class="promoBtn"
                    style="width: 160px; height: 46px; flex-shrink: 0"
                    :b-color="'#fff'"
                    @click="checkPromocode"
                    name="Применить"
                  />
                </div>
                <span class="warning" v-if="noPromocode">{{
                  noPromocode
                }}</span>
              </div>
              <div v-else class="d-flex-column">
                <h3>
                  Промокод {{ aprovedPromocode?.name }} на
                  {{ aprovedPromocode?.discount }} <strong>₽</strong> применен
                </h3>
              </div>
            </div>
          </div>
          <span v-if="isInvalidData" class="message"
            >Проверьте правильность заполнения полей</span
          >
          <div class="bottom">
            <CustomButton @click="onCreateOrder" :name="'Оформить заказ'" />
            <p class="policy">
              Нажимая «оформить заказ», вы соглашаетесь с
              <a
                href="https://841301.selcdn.ru/rkTech/rkTechPolicy.pdf"
                class="policyLink"
                >политикой обработки персональных данных.</a
              >
            </p>
          </div>
        </div>

        <div v-else-if="isApprovedOrder" class="approvedOrder">
          <div class="icoAccept" />
          <span class="acceptMesg">
            Заказ успешно оформлен, в ближайшее время мы с Вами свяжемся
          </span>
        </div>

        <div
          v-else
          class="empty"
          role="dialog"
          aria-modal="true"
          aria-labelledby="emptyBagTitle"
        >
          <button
            type="button"
            class="emptyClose"
            aria-label="Закрыть корзину"
            @click="closeShopBag()"
          />
          <div class="emptyIllustration" aria-hidden="true">
            <svg class="emptyBag" viewBox="0 0 64 64" fill="none">
              <path
                d="M14 20h36l-2.6 28.4A6 6 0 0 1 41.4 54H22.6a6 6 0 0 1-6-5.6L14 20Z"
                stroke="currentColor"
                stroke-width="3"
                stroke-linejoin="round"
              />
              <path
                d="M24 26V18a8 8 0 0 1 16 0v8"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <div class="emptyText">
            <h3 id="emptyBagTitle">Корзина пуста</h3>
            <p>
              Добавьте товары — они появятся здесь, и вы сможете оформить заказ.
            </p>
          </div>
          <div class="emptyAction">
            <CustomButton :name="'Перейти к покупкам'" @click="closeShopBag()" />
          </div>
          <div class="emptySuggest">
            <span class="emptySuggestTitle">Популярные категории</span>
            <div class="emptyChips">
              <NuxtLink
                v-for="link in popularCategories"
                :key="link.name"
                :to="link.link"
                class="emptyChip"
                @click="closeShopBag()"
              >
                <img
                  :src="link.ico"
                  class="emptyChipIco"
                  alt=""
                  aria-hidden="true"
                  width="14"
                  height="14"
                  loading="lazy"
                  decoding="async"
                />
                <span>{{ link.name }}</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup>
// eslint-disable-next-line import/no-extraneous-dependencies
import { ref, computed, watch } from 'vue';
import { useApi } from '~/stores/api';
import { useCategories } from '~/stores/categories';

const api = useApi();
const categories = useCategories();

const emit = defineEmits(['closeShopBag']);

const popularCategories = computed(() => categories.categories
  .filter((el) => !el.isHiddenForHeader)
  .slice(0, 5));

const itemsCount = computed(() => api.orders.reduce(
  (total, order) => total + (order.quantity || 1),
  0,
));

const itemsCountLabel = computed(() => {
  const count = itemsCount.value;
  const rest = count % 100;
  const last = count % 10;

  if (rest > 10 && rest < 20) return `${count} товаров`;
  if (last === 1) return `${count} товар`;
  if (last > 1 && last < 5) return `${count} товара`;
  return `${count} товаров`;
});

const userData = ref({});
const currentSel = ref(1);
const isInvalidData = ref(false);
const isApprovedOrder = ref(false);
const isEmptyShopBag = ref(true);
const promocodeName = ref(null);
const aprovedPromocode = ref(null);
const noPromocode = ref(null);
const selectedPaymentType = ref(1);

const radioVariants = ref([
  {
    name: 'Самовывоз из офиса г. Москва',
    id: 1,
    info: 'Самовывоз - бесплатно. Ул. Багратионовский проезд, 7к2, Бизнес-центр «Рубин». Внимание! Самовывоз из офиса в Москве осуществляется только по предварительному заказу после подтверждения менеджером наличия и актуальной стоимости товаров.',
  },
  {
    name: 'Самовывоз из магазина г. Рязань',
    id: 4,
    info: 'Самовывоз - бесплатно. Рязань, ул. Кольцова, дом 12',
  },
  {
    name: 'Доставка по Москве внутри МКАД',
    id: 2,
    info: 'Курьерская доставка в Москве - бесплатно/490р',
  },
  {
    name: 'Доставка по Москве за пределы МКАД',
    id: 5,
    info: 'Расчитывается индивидуально',
  },
  {
    name: 'Доставка курьером в г. Рязань в пределах города',
    id: 6,
  },
  {
    name: 'Доставка СДЭК в регионы',
    id: 3,
    info: 'Доставка по России - бесплатно/490р. Надежно упакуем и отправим в день заказа транспортной компанией «Сдэк».',
  },
]);

const paymentTypes = ref([
  {
    id: 1,
    name: 'Наличными при получении',
  },
  {
    id: 2,
    name: 'Оформление рассрочки',
  },
  {
    id: 3,
    name: 'Б/р для юридических лиц без НДС',
  },
]);

const closeShopBag = () => {
  emit('closeShopBag');
  isApprovedOrder.value = false;
};

const options = ref([
  { name: 'Самовывоз', info: '' },
  { name: 'Доставка по Москве', info: '' },
  { name: 'Доставка по России', info: '' },
]);

const orders = ref(api.orders);

watch(() => api.orders, (newVal) => {
  isEmptyShopBag.value = !!newVal.length;
  // Количество меняется прямо в корзине — пересчитываем итог
  if (newVal.length) api.getTotalCost();
}, { deep: true, immediate: true });

// eslint-disable-next-line max-len
const getPriceByProduct = (product, selectedOptionIds) => product.variants.find(({ optionsIds }) => optionsIds.every((optionId) => selectedOptionIds.includes(optionId))).optionsInfo.price;
// eslint-disable-next-line max-len
const getTagByProduct = (product, selectedOptionIds) => product.options.map(
  (opt) => opt.items.find((item) => selectedOptionIds.includes(item.id)).name,
);

// eslint-disable-next-line max-len
const getImgByProduct = (product, selectedOptionIds) => product.variants.find(({ optionsIds }) => optionsIds.every((optionId) => selectedOptionIds.includes(optionId))).optionsInfo.images;

const checkPromocode = async () => {
  if (promocodeName.value) {
    const res = await api.getPromocode(promocodeName.value);
    if (res !== 0) {
      aprovedPromocode.value = res;
      noPromocode.value = null;
    } else {
      noPromocode.value = 'К сожалению, такого промокода не существует';
      setTimeout(() => {
        noPromocode.value = null;
      }, 3000);
    }
  }
};

const onCreateOrder = () => {
  const items = api.orders.map((item) => {
    // Вычисляем базовую цену за единицу товара
    let basePrice;
    if (item.product.variants.length) {
      basePrice = getPriceByProduct(item.product, item.options);
    } else {
      basePrice = item.product.price;
    }

    // Применяем промокод к базовой цене
    const pricePerUnit = aprovedPromocode.value?.discount
      ? basePrice - (aprovedPromocode.value.discount || 0)
      : basePrice;

    // Вычисляем общую цену за все количество товара
    const totalPrice = pricePerUnit * (item.quantity || 1);

    return {
      productUUID: item.product.uuid,
      price: totalPrice,
      name: item.product.name,
      tags: item.product.variants.length
        ? getTagByProduct(item.product, item.options)
        : null,
      // eslint-disable-next-line max-len
      images: item.product.variants.length
        ? getImgByProduct(item.product, item.options)
        : [item.product.images?.[0]],
      count: item.quantity || 1,
    };
  });

  const ordersData = {
    fullName: userData.value.name,
    phoneNumber: userData.value.tel,
    promoCodeUUID: aprovedPromocode.value?.uuid || null,
    items,
    communicationMethod: 0,
    delivery: currentSel.value,
    deliveryMessage: userData.value.address,
    discountAmount: aprovedPromocode.value?.discount,
    paymentTypeId: selectedPaymentType.value,
  };

  if (ordersData?.fullName?.length && ordersData?.phoneNumber) {
    api.createOrder(ordersData);
    isApprovedOrder.value = true;
    api.orders = [];
    localStorage.removeItem('orders');
  } else isInvalidData.value = true;
};

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
  if (api.orders.length) {
    document.body.style.overflow = 'hidden';
    api.getTotalCost();
  }
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
  z-index: 7;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.636);
  overflow-x: auto;
  @media (max-width: 500px) {
    padding: 0;
    align-items: stretch;
  }
}

.wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 32px;
  background-color: #fff;
  border: 1px solid #f0f0f0;
  box-shadow: 0 18px 50px rgba(44, 44, 44, 0.16);
  border-radius: 28px;
  padding: 40px;
  width: min(560px, calc(100vw - 40px));
  overflow: auto;
  height: fit-content;
  box-sizing: border-box;

  @media (max-width: 500px) {
    width: 100%;
    border-radius: 0;
    padding: 22px;
    padding-top: 50px;
  }

  .wr {
    height: 100%;
  }
  .close {
    background: transparent url(/icons/close.svg) center / 15px 15px no-repeat;
    position: absolute;
    top: 16px;
    right: 16px;
    width: 32px;
    height: 32px;
    padding: 0;
    border: none;
    border-radius: 50%;
    flex-shrink: 0;
    opacity: 0.4;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      opacity: 1;
      background-color: #f4f4f4;
    }

    @media (max-width: 500px) {
      top: 12px;
      right: 12px;
    }
  }
}

.approvedOrder {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
  padding: 36px 12px;
  gap: 32px;
  width: 300px;
  background-color: #fff;
  border: 1px solid #eee;
  box-shadow: 0 0 20px rgb(160, 160, 160);
  border-radius: 24px;
}

.icoAccept {
  background-image: url(/icons/accept.svg);
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  width: 80px;
  height: 80px;
}
.orderContainer {
  position: relative;
  z-index: 6;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 20px;
  font-size: 30px;
  width: 100%;
  box-sizing: border-box;
}

.body {
  display: flex;
  flex-direction: column;
  gap: 22px;
  justify-content: space-between;
  width: 100%;

  h3 {
    font-size: 16px;
    font-weight: 600;
  }
}

.warning {
  font-size: 13px;
  color: red;
}

.inputsContainer {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  width: 100%;

  @media (min-width: 560px) {
    grid-template-columns: 1fr 1fr;
  }
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

.variant {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 14px;
  border: 1.5px solid #eee;
  border-radius: 12px;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;

  &:hover {
    border-color: #d8d8d8;
  }

  &--active {
    border-color: #2c2c2c;
    background-color: #fafafa;
  }
}

.rowVariant {
  display: flex;
  gap: 10px;
  align-items: center;
}

.icoQuestion {
  position: relative;
  background-image: url(/icons/question.svg);
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width: 20px;
  height: 20px;
  opacity: 0.2;
  cursor: pointer;
  transition: 0.2s;
  flex-shrink: 0;
  box-sizing: border-box;
  // &:hover {
  //   opacity: 1;
  //   .annotation {
  //     opacity: 1;
  //     display: block;
  //   }
  // }
}
.annotation {
  position: absolute;
  bottom: 0px;
  left: 25px;
  background-color: #eee;
  padding: 10px;
  border-radius: 12px;
  font-size: 15px;
  width: 150px;
  height: fit-content;
  opacity: 0;
  display: none;
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
  gap: 8px;
  width: 100%;
  max-height: 380px;
  box-sizing: border-box;
}

.shopBagHead {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding-bottom: 4px;
}

.itemsCount {
  font-size: 13px;
  font-weight: 300;
  color: #9a9a9a;
}

.allCost {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-top: 4px;
  padding: 14px 16px;
  border-radius: 14px;
  background-color: #fafafa;

  .name {
    font-size: 15px;
    color: #6c6c6c;
  }

  .price,
  .discount {
    font-size: 19px;
    font-weight: 600;
  }
}

.allPrice {
  display: flex;
  align-items: baseline;
  gap: 2px;
  font-size: 19px;
  font-weight: 600;
  color: #2c2c2c;
}

.discount {
  color: #d33a3a;
  margin-left: 8px;
}

.message {
  color: rgb(242, 23, 23);
}

.bottom {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.policy {
  font-size: 13px;
}

.policyLink {
  text-decoration: underline;
  color: #2c2c2c;
}

.empty {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 20px;
  background-color: #fff;
  padding: 44px 32px 32px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 18px 50px rgba(44, 44, 44, 0.16);
  border-radius: 28px;
  width: min(400px, calc(100vw - 32px));
  box-sizing: border-box;
  animation: emptyIn 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.emptyClose {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: #fff url(/icons/close.svg) center / 15px 15px no-repeat;
  opacity: 0.4;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    opacity: 1;
    background-color: #f4f4f4;
  }
}

.emptyIllustration {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 112px;
  height: 112px;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 32%, #fbfbfb 0%, #efefef 100%);
  box-shadow: inset 0 0 0 1px #ededed, 0 0 0 10px rgba(44, 44, 44, 0.02);
  animation: emptyPop 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.06s backwards;
}

.emptyBag {
  width: 56px;
  height: 56px;
  color: #2c2c2c;
  opacity: 0.5;
}

.emptyText {
  display: flex;
  flex-direction: column;
  gap: 8px;

  h3 {
    font-size: 22px;
  }

  p {
    max-width: 260px;
    margin: 0 auto;
    font-size: 14px;
    line-height: 1.5;
    color: #8a8a8a;
  }
}

.emptyAction {
  width: 100%;
  max-width: 260px;
}

.emptySuggest {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding-top: 20px;
  border-top: 1px solid #f2f2f2;
}

.emptySuggestTitle {
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #a8a8a8;
}

.emptyChips {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.emptyChip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border: 1px solid #ececec;
  border-radius: 999px;
  background-color: #fff;
  font-size: 13px;
  color: #2c2c2c;
  transition: 0.2s;

  &:hover {
    border-color: #2c2c2c;
    box-shadow: 0 4px 12px rgba(44, 44, 44, 0.08);
    transform: translateY(-1px);

    .emptyChipIco {
      opacity: 1;
    }
  }
}

.emptyChipIco {
  width: 14px;
  height: 14px;
  object-fit: contain;
  opacity: 0.45;
  transition: 0.2s;
}

@keyframes emptyIn {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes emptyPop {
  from {
    opacity: 0;
    transform: scale(0.6);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .empty,
  .emptyIllustration {
    animation: none;
  }

  .emptyChip:hover {
    transform: none;
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  position: absolute;
  opacity: 0;
}

::v-deep {
  // «Применить» — второстепенное действие рядом с главным CTA
  .customButton.promoBtn {
    color: #2c2c2c;
    border: 1.5px solid #e6e6e6;
    box-shadow: none;

    &:hover {
      border-color: #2c2c2c;
      box-shadow: none;
      transform: none;
    }
  }

  .el-select .el-input__wrapper {
    height: 46px;
    padding: 0 14px;
    border-radius: 12px;
    box-shadow: 0 0 0 1.5px #e6e6e6 inset;
    transition: box-shadow 0.2s;

    &:hover {
      box-shadow: 0 0 0 1.5px #d8d8d8 inset;
    }
  }

  .el-select .el-input.is-focus .el-input__wrapper,
  .el-select .el-input__wrapper.is-focused {
    box-shadow: 0 0 0 1.5px #2c2c2c inset;
  }

  .el-input__inner {
    font-size: 15px;
    color: #2c2c2c;
  }

  .el-radio {
    margin-right: 0;
  }
  .el-radio__input.is-checked {
    span.el-radio__inner {
      background-color: #1e1e1e;
      border-color: #000;
    }
    & + .el-radio__label {
      color: #000 !important;
    }
  }
  .el-radio__label {
    text-wrap: wrap;
  }
}
</style>
