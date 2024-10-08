<template>
  <div class="mainCardProduct">
    <div class="mainCardContainer">
      <div class="image-container">
        <img
          v-if="baseImg"
          class="imgProduct"
          :src="baseImg"
          alt="Изображение продукта"
        />
        <el-button
          v-if="baseImg"
          type="danger"
          class="delete"
          :icon="Delete"
          circle
          @click="deleteImg"
        />
        <DropZone v-if="!baseImg" @drop.prevent="drop" @change="selectedFile" />
      </div>
      <div class="info-background">
        <div class="infoContainer">
          <div class="header">
            <Input
              :value="product.name"
              type="text"
              @inputValue="(val) => (formData.name = val)"
            />
            <Input
              v-if="api.isAuth"
              :value="price"
              type="number"
              @inputValue="setVariants"
            />
            <Input
              v-if="api.isAuth"
              textArea
              :value="product?.description"
              type="text"
              @inputValue="(val) => (formData.description = val)"
            />
            <!-- <Input
              v-if="api.isAuth"
              :value="product?.sortValue"
              type="text"
              @inputValue="(val) => (formData.sortValue = val)"
            /> -->
            <div class="d-flex mt-2 align-center j-b">
              <span>Сортировка</span>
              <el-input-number
                v-if="api.isAuth"
                :model-value="product?.sortValue"
                :min="1"
                :max="100"
                @change="(val) => (formData.sortValue = val)"
              />
            </div>
          </div>
          <div class="optionsContainer">
            <Option
              v-for="(option, idOpt) in product?.options"
              :key="option?.name"
              :option="option"
              @selectedOpt="(id) => selectedOpt(id, idOpt)"
              @onEdit="(val) => (editOption = val)"
            />
          </div>
          <div v-if="api.isAuth" class="d-flex align-center gap-2">
            <el-switch
              v-model="isPriceDependOnColor"
              inline-prompt
              @change="setNotification"
            />
            <span>Цена зависит от цвета</span>
          </div>
        </div>
        <div v-if="editOption" class="edit-options">
          <h3>Редактирование опций</h3>
          <el-input v-model="editOption.name" type="text" />
          {{ editOption.name }}
          <div class="d-flex">
            <el-button type="primary" @click="editOption = null"
              >Отменить</el-button
            >
            <el-button type="success">Сохранить</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="wrapperButton">
      <CustomButton
        v-if="!api.isAuth"
        @click="sendToShopBag"
        :name="'В корзину'"
      />
      <div v-if="api.isAuth" class="icoDelete" @click="onDeleteProduct"></div>
      <CustomButton
        v-if="api.isAuth"
        :type="isSaved ? 'accept' : ''"
        :b-color="isSaved ? '#4CAF50' : '#2c2c2c'"
        :isLoading="isLoading"
        @click="onSaveProductData"
        :name="!isSaved ? 'Сохранить' : 'Сохранено'"
      />
    </div>
  </div>
</template>

<script setup>
// eslint-disable-next-line import/no-extraneous-dependencies
import { ref, computed, watch } from "vue";
import { useApi } from "~/stores/api";
import { useCategories } from "~/stores/categories";
import { Delete } from "@element-plus/icons-vue";

const categories = useCategories();

const api = useApi();

const emit = defineEmits(["selectedProducts"]);
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  product: Object,
});

const editOption = ref(null);
const selectedOptions = ref([]);
const isLoading = ref(false);
const isSaved = ref(false);
const isPriceDependOnColor = ref(false);
const setNotification = ref(false);
const formData = ref(JSON.parse(JSON.stringify(props.product)));
const dropzoneFile = ref({ url: null, file: null });
const urlFile = ref(null);
const uploadedImgSrc = ref(null);

const currentCategory = window.location.pathname.split("/").pop();
const uuidCurrentCategory = categories.categories.find((el) =>
  el.link.includes(currentCategory)
)?.uuid;

const isColorOpt = (options) => (optionId) => {
  const colorOption = options.find((el) =>
    el.name.toLowerCase().includes("цвет")
  );
  if (!colorOption) {
    return true;
  }
  if (options.length > 1) {
    return !colorOption.items.some((el) => el.id === optionId);
  }
  return colorOption.items.some((el) => el.id === optionId);
};

const baseImg = computed(() => {
  if (selectedOptions.value.length) {
    let canditate = null;
    formData.value.variants.forEach(({ optionsIds }, idx) => {
      const isContains = optionsIds.every((optionId) =>
        selectedOptions.value.includes(optionId)
      );

      if (isContains) {
        canditate = formData.value?.variants[idx];
      }
    });
    return canditate?.optionsInfo?.images?.[0] || formData.value?.images?.[0];
  }
  return (
    formData.value?.variants?.[0]?.optionsInfo?.images?.[0] ||
    formData.value?.images?.[0]
  );
});

const price = computed(() => {
  const { variants, price: defaultPrice } = formData.value;

  if (selectedOptions.value.length) {
    const candidate = variants.find(({ optionsIds }) =>
      optionsIds.every((optionId) => selectedOptions.value.includes(optionId))
    );

    return candidate?.optionsInfo?.price >= 0 ? candidate?.optionsInfo?.price : defaultPrice;
  }

  return defaultPrice;
});

const priceFrmt = (val) =>
  val ? new Intl.NumberFormat("ru").format(val) : null;

const selectedOpt = (id, index) => {
  selectedOptions.value[index] = id;
};

const setVariants = (newPrice) => {
  const { variants, options } = formData.value;

  const notColorOptions = selectedOptions.value.filter(isColorOpt(options));

  if (!options.length) {
    formData.value.price = newPrice;
  }

  variants.forEach(({ optionsIds, optionsInfo }, idx) => {
    const isCandidate = (
      props.product.priceDependOnColor ? selectedOptions.value : notColorOptions
    ).every((id) => optionsIds.includes(id));

    if (isCandidate) {
      optionsInfo.price = newPrice;
    }
  });
};

const deleteImg = () => {
  const { variants, options } = formData.value;
  const notColorOptions = selectedOptions.value.filter(isColorOpt(options));

  variants.forEach(({ optionsIds }, idx) => {
    const isCandidate = (
      props.product.priceDependOnColor ? selectedOptions.value : notColorOptions
    ).every((id) => optionsIds.includes(id));
    if (isCandidate) {
      variants[idx].optionsInfo.images = [];
    }
  });
  formData.value.images = [];
};

const onSaveProductData = async () => {
  isLoading.value = true;
  const oldVariants = props.product.variants;
  const { variants, options } = formData.value;
  const notColorOptions = selectedOptions.value.filter(isColorOpt(options));

  variants.forEach((variant, idx) => {
    const oldVariant = oldVariants[idx];

    const currentPrice = oldVariant.optionsInfo?.price;
    const previousOldPrice = oldVariant.optionsInfo?.oldPrice;

    // eslint-disable-next-line no-param-reassign, max-len
    variant.optionsInfo.oldPrice =
      currentPrice !== previousOldPrice ? currentPrice : previousOldPrice;
  });
  console.log(formData.value.price);
  const updatedProductData = {
    name: formData.value.name || props.product.name,
    variants: formData.value.variants,
    price:
      formData.value.price >= 0 ? formData.value.price : props.product.price,
    priceOld: formData.value.price
      ? props.product.price
      : props.product?.priceOld,
    description: formData.value.description || props.product.description,
    priceDependOnColor: isPriceDependOnColor.value,
    images: formData.value.images,
    sortValue: formData.value.sortValue,
  };

  try {
    const res = await api.updateProduct(props.product.uuid, updatedProductData);
    isSaved.value = true;
    api.getProducts(uuidCurrentCategory);
    setTimeout(() => {
      isSaved.value = false;
    }, 3000);
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

const onDeleteProduct = () => {
  api.deleteProduct(props.product.uuid);

  if (uuidCurrentCategory) {
    api.getProducts(uuidCurrentCategory);
  }
};

const drop = (event) => {
  event.preventDefault();
  // eslint-disable-next-line prefer-destructuring
  dropzoneFile.value.url = event.dataTransfer.files[0];
  // eslint-disable-next-line prefer-destructuring
  urlFile.value = URL.createObjectURL(dropzoneFile.value?.url);
};

const selectedFile = async () => {
  // eslint-disable-next-line prefer-destructuring
  dropzoneFile.value.url = document.querySelector(".dragZone").files[0];
  urlFile.value = URL.createObjectURL(dropzoneFile.value?.url);
  const formDataImg = new FormData(); // Создаем экземпляр FormData
  formDataImg.append("file", dropzoneFile.value.url);
  const res = await api.uploadImg(formDataImg);

  const { variants, options } = formData.value;
  const notColorOptions = selectedOptions.value.filter(isColorOpt(options));

  variants.forEach(({ optionsIds }, idx) => {
    const isCandidate = (
      props.product.priceDependOnColor ? selectedOptions.value : notColorOptions
    ).every((id) => optionsIds.includes(id));
    if (isCandidate) {
      variants[idx].optionsInfo.images.push(res.full);
    }
  });

  formData.value.images[0] = res.full;
};

// eslint-disable-next-line no-undef
onMounted(() => {
  isPriceDependOnColor.value = props.product.priceDependOnColor;
});
</script>

<style scoped lang="scss">
.mainCardProduct {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 330px;
  border: 1px solid #eee;
  box-shadow: 0 0 10px #eee;
  border-radius: 12px;
}

.wrapperButton {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 30px 20px;
  width: 100%;
  box-sizing: border-box;
}

.mainCardContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}

.imgProduct {
  width: 250px;
  height: 250px;
  background-color: #fff;
  object-fit: contain;
}

.infoContainer {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

.info-background {
  position: relative;
  width: 100%;
}

.edit-options {
  position: absolute;
  width: 100%;
  top: 0;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #333;
  border-radius: 4px;
  box-sizing: border-box;
  flex-shrink: 0;
  padding: 20px;
}

.productName {
  font-size: 20px;
  font-family: -apple-system, Roboto, BlinkMacSystemFont, "Segoe UI", Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-weight: 400;
}

.priceRow {
  display: flex;
  gap: 12px;
}

.oldPrice {
  font-family: -apple-system, Roboto, BlinkMacSystemFont, "Segoe UI", Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 18px;
  font-weight: 300;
  color: #373737;
  text-decoration: line-through;
}

.price {
  font-family: -apple-system, Roboto, BlinkMacSystemFont, "Segoe UI", Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 18px;
  font-weight: 300;
  color: #373737;
}

.description {
  padding-top: 6px;
}

.optionsContainer {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.icoDelete {
  background-image: url(/icons/delete.svg);
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width: 40px;
  height: 40px;
  padding: 15px;
  box-sizing: border-box;
  border: 1px solid #2c2c2c;
  border-radius: 8px;
  opacity: 0.9;
  cursor: pointer;
}

.image-container {
  position: relative;
  width: 250px;
  height: 250px;
  background-color: #eee;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete {
  position: absolute;
  top: 30px;
  right: 10px;
}
</style>
