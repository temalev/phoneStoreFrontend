<template>
  <div class="mainCardProduct" :class="{ 'is-new': isNewProduct }">
    <div class="mainCardContainer">
      <div v-loading="isImageUploading" class="image-container">
        <img v-if="baseImg" class="imgProduct" :src="baseImg" alt="Изображение продукта" />
        <el-button v-if="baseImg" type="danger" class="delete" :icon="Delete" circle @click="deleteImg" />
        <DropZone v-if="!baseImg" @drop.prevent="drop" @change="selectedFile" />
      </div>
      <div class="info-background">
        <div class="infoContainer">
          <div class="header">
            <Input :value="product.name" type="text" @inputValue="(val) => (formData.name = val)" />
            <Input v-if="api.isAuth" :value="price" type="number" @inputValue="setVariants" />
            <Input v-if="api.isAuth" textArea :value="product?.description" type="text"
              @inputValue="(val) => (formData.description = val)" />
            <!-- <Input
              v-if="api.isAuth"
              :value="product?.sortValue"
              type="text"
              @inputValue="(val) => (formData.sortValue = val)"
            /> -->
            <div class="d-flex mt-2 align-center j-b">
              <span>Сортировка</span>
              <el-input-number v-if="api.isAuth" :model-value="product?.sortValue" :min="1" :max="100"
                @change="(val) => (formData.sortValue = val)" />
            </div>
          </div>
          <div class="optionsContainer">
            <Option v-for="(option, idOpt) in localOptions" :key="`${option?.name}-${idOpt}`" :option="option"
              :show-sync-button="api.isAuth && !isColorOption(option)" :option-index="idOpt"
              @selectedOpt="(id) => selectedOpt(id, idOpt)" @onEdit="(val) => (editOption = val)"
              @moveColor="(data) => moveColorItem(idOpt, data)"
              @deleteColor="(colorId) => onDeleteColor(idOpt, colorId)" @sync="syncPhotosForOption(idOpt)" />
          </div>
          <div v-if="api.isAuth" class="d-flex align-center gap-2">
            <el-switch v-model="isPriceDependOnColor" inline-prompt @change="setNotification" />
            <span>Цена зависит от цвета</span>
          </div>
        </div>
        <div v-if="editOption" class="edit-options">
          <h3>Редактирование опций</h3>
          <el-input v-model="editOption.name" type="text" />
          {{ editOption.name }}
          <div class="d-flex">
            <el-button type="primary" @click="editOption = null">Отменить</el-button>
            <el-button type="success">Сохранить</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="wrapperButton">
      <CustomButton v-if="!api.isAuth" @click="sendToShopBag" :name="'В корзину'" />
      <el-button v-if="api.isAuth && !isNewProduct" :loading="isDeleting" :disabled="isDeleting" @click="onDeleteProduct">
        <div v-if="!isDeleting" class="icoDelete"></div>
      </el-button>
      <el-tooltip v-if="api.isAuth && !isNewProduct" content="Копировать товар" placement="top">
        <el-button :icon="CopyDocument" @click="copyProduct" />
      </el-tooltip>
      <CustomButton v-if="api.isAuth" :type="isSaved ? 'accept' : ''" :b-color="isSaved ? '#4CAF50' : '#2c2c2c'"
        :isLoading="isLoading" @click="onSaveProductData"
        :name="isSaved ? (isNewProduct ? 'Создан' : 'Сохранено') : (isNewProduct ? 'Создать' : 'Сохранить')" />
    </div>
  </div>
</template>

<script setup>
// eslint-disable-next-line import/no-extraneous-dependencies
import { ref, computed } from "vue";
import { useApi } from "~/stores/api";
import { useCategories } from "~/stores/categories";
import { Delete, CopyDocument } from "@element-plus/icons-vue";
import { ElMessageBox, ElMessage } from "element-plus";

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
const isDeleting = ref(false);
const isSaved = ref(false);
const isPriceDependOnColor = ref(false);
const setNotification = ref(false);
const formData = ref(JSON.parse(JSON.stringify(props.product)));
const localOptions = ref(JSON.parse(JSON.stringify(props.product.options || [])));
const dropzoneFile = ref({ url: null, file: null });
const urlFile = ref(null);
const uploadedImgSrc = ref(null);
const isImageUploading = ref(false);

const currentCategory = window.location.pathname.split("/").pop();
const uuidCurrentCategory = categories.categories.find((el) =>
  el.link.includes(currentCategory)
)?.uuid;

const isNewProduct = computed(() => !props.product.uuid);

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

  if (!isPriceDependOnColor.value) {
    return defaultPrice;
  }

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

const moveColorItem = (optionIndex, { from, to }) => {
  // Создаем копию массива items
  const items = [...localOptions.value[optionIndex].items];
  const [movedItem] = items.splice(from, 1);
  items.splice(to, 0, movedItem);

  // Обновляем массив items реактивно
  localOptions.value[optionIndex].items = items;
};

const onDeleteColor = async (optionIndex, colorId) => {
  try {
    // Получаем информацию о цвете для отображения в диалоге
    const colorOption = localOptions.value[optionIndex];
    const colorItem = colorOption.items.find((item) => item.id === colorId);
    const colorName = colorItem?.name || 'этот цвет';

    // Показываем диалог подтверждения
    await ElMessageBox.confirm(
      `Вы уверены, что хотите удалить цвет "${colorName}"? Все варианты товара с этим цветом также будут удалены.`,
      'Подтверждение удаления цвета',
      {
        confirmButtonText: 'Удалить',
        cancelButtonText: 'Отмена',
        type: 'warning',
      },
    );
  } catch (error) {
    // Пользователь отменил действие
    return;
  }

  // Удаляем цвет из опций
  const colorIndex = localOptions.value[optionIndex].items.findIndex(
    (item) => item.id === colorId,
  );
  if (colorIndex !== -1) {
    localOptions.value[optionIndex].items.splice(colorIndex, 1);
  }

  // Удаляем все варианты, содержащие этот цвет
  formData.value.variants = formData.value.variants.filter(
    (variant) => !variant.optionsIds.includes(colorId),
  );

  ElMessage({
    type: 'success',
    message: 'Цвет успешно удален',
  });
};

const setVariants = (newPrice) => {
  if (!isPriceDependOnColor.value) {
    formData.value.price = newPrice;
    return;
  }

  const { variants, options } = formData.value;
  const notColorOptions = selectedOptions.value.filter(isColorOpt(options));

  variants.forEach(({ optionsIds, optionsInfo }) => {
    const isCandidate = selectedOptions.value.every((id) => optionsIds.includes(id));

    if (isCandidate) {
      optionsInfo.price = newPrice;
    }
  });
};

const deleteImg = () => {
  const { variants, options } = formData.value;

  // Находим опцию цвета
  const colorOption = options.find((el) => el.name.toLowerCase().includes('цвет'));

  if (!colorOption) {
    // Если нет цветовой опции, удаляем изображения по старой логике
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
    return;
  }

  // Получаем индекс опции цвета
  const colorOptionIndex = options.findIndex((el) => el.name.toLowerCase().includes('цвет'));
  const selectedColorId = selectedOptions.value[colorOptionIndex];

  // Удаляем изображения только для вариантов с выбранным цветом
  variants.forEach(({ optionsIds }, idx) => {
    if (optionsIds.includes(selectedColorId)) {
      // Проверяем, соответствуют ли остальные опции (кроме цвета)
      const otherOptionsMatch = selectedOptions.value.every((selectedId, optIdx) => {
        if (optIdx === colorOptionIndex) return true; // Пропускаем цвет
        return optionsIds.includes(selectedId);
      });

      if (otherOptionsMatch) {
        variants[idx].optionsInfo.images = [];
      }
    }
  });
};

const isColorOption = (option) => option?.name?.toLowerCase().includes('цвет');

const syncPhotosForOption = (optionIndex) => {
  const { variants, options } = formData.value;
  const option = options?.[optionIndex];
  if (!option?.items?.length || !variants?.length) return;
  const colorOptionIndex = options?.findIndex((o) => o?.name?.toLowerCase().includes('цвет'));
  const firstItemId = option.items[0].id;

  if (colorOptionIndex >= 0 && options[colorOptionIndex]?.items) {
    options[colorOptionIndex].items.forEach((colorItem) => {
      const colorId = colorItem.id;
      const sourceVariant = variants.find((v) => (
        v.optionsIds[colorOptionIndex] === colorId
        && v.optionsIds[optionIndex] === firstItemId
      ));
      const sourceImages = [...(sourceVariant?.optionsInfo?.images || [])];
      for (let j = 1; j < option.items.length; j += 1) {
        const itemId = option.items[j].id;
        variants.forEach((v) => {
          if (v.optionsIds[colorOptionIndex] === colorId && v.optionsIds[optionIndex] === itemId) {
            v.optionsInfo.images = [...sourceImages];
          }
        });
      }
    });
  } else {
    const sourceVariant = variants.find((v) => v.optionsIds[optionIndex] === firstItemId);
    const sourceImages = [...(sourceVariant?.optionsInfo?.images || [])];
    for (let j = 1; j < option.items.length; j += 1) {
      const itemId = option.items[j].id;
      variants.forEach((v) => {
        if (v.optionsIds[optionIndex] === itemId) {
          v.optionsInfo.images = [...sourceImages];
        }
      });
    }
  }
  ElMessage({ type: 'success', message: 'Фото синхронизированы' });
};

const copyProduct = () => {
  const copy = JSON.parse(JSON.stringify(props.product));
  delete copy.uuid;
  copy._tempId = `copy-${Date.now()}`;

  const products = api.products[currentCategory];
  const idx = products.findIndex((p) => p.uuid === props.product.uuid);
  products.splice(idx + 1, 0, copy);
};

const onSaveProductData = async () => {
  isLoading.value = true;

  const { variants, options } = formData.value;

  const productPayload = {
    name: formData.value.name || props.product.name,
    variants: formData.value.variants,
    price: formData.value.price >= 0 ? formData.value.price : props.product.price,
    description: formData.value.description || props.product.description,
    priceDependOnColor: isPriceDependOnColor.value,
    images: formData.value.images,
    sortValue: formData.value.sortValue,
    options: localOptions.value,
  };

  try {
    if (isNewProduct.value) {
      const createData = {
        ...productPayload,
        categoryUUID: uuidCurrentCategory,
      };
      const res = await api.createdProduct(createData);

      if (res) {
        const products = api.products[currentCategory];
        const idx = products.findIndex((p) => p._tempId === props.product._tempId);
        if (idx !== -1) products.splice(idx, 1, res);

        isSaved.value = true;
        ElMessage({ type: 'success', message: 'Товар успешно создан' });
        setTimeout(() => { isSaved.value = false; }, 3000);
      }
      return;
    }

    const oldVariants = props.product.variants;
    variants.forEach((variant, idx) => {
      const oldVariant = oldVariants[idx];
      const currentPrice = oldVariant.optionsInfo?.price;
      const previousOldPrice = oldVariant.optionsInfo?.oldPrice;
      // eslint-disable-next-line no-param-reassign
      variant.optionsInfo.oldPrice =
        currentPrice !== previousOldPrice ? currentPrice : previousOldPrice;
    });

    await api.updateProduct(props.product.uuid, {
      ...productPayload,
      priceOld: formData.value.price ? props.product.price : props.product?.priceOld,
    });

    if (uuidCurrentCategory) {
      await api.getProducts(uuidCurrentCategory);
    }

    isSaved.value = true;
    ElMessage({ type: 'success', message: 'Товар успешно обновлен' });
    setTimeout(() => { isSaved.value = false; }, 3000);
  } catch (e) {
    console.error(e);
    ElMessage({
      type: 'error',
      message: isNewProduct.value ? 'Ошибка при создании товара' : 'Ошибка при сохранении товара',
    });
  } finally {
    isLoading.value = false;
  }
};

const onDeleteProduct = async () => {
  try {
    await ElMessageBox.confirm(
      'Вы уверены, что хотите удалить этот товар?',
      'Подтверждение удаления',
      {
        confirmButtonText: 'Удалить',
        cancelButtonText: 'Отмена',
        type: 'warning',
      },
    );
  } catch (error) {
    // Пользователь отменил действие
    return;
  }

  isDeleting.value = true;

  try {
    await api.deleteProduct(props.product.uuid);

    ElMessage({
      type: 'success',
      message: 'Товар успешно удален',
    });

    if (uuidCurrentCategory) {
      await api.getProducts(uuidCurrentCategory);
    }
  } catch (error) {
    ElMessage({
      type: 'error',
      message: 'Ошибка при удалении товара',
    });
    console.error(error);
  } finally {
    isDeleting.value = false;
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
  isImageUploading.value = true;
  try {
    // eslint-disable-next-line prefer-destructuring
    dropzoneFile.value.url = document.querySelector(".dragZone").files[0];
    urlFile.value = URL.createObjectURL(dropzoneFile.value?.url);
    const formDataImg = new FormData(); // Создаем экземпляр FormData
    formDataImg.append("file", dropzoneFile.value.url);
    const res = await api.uploadImg(formDataImg);

    const { variants, options } = formData.value;

    if (!variants?.length) {
      if (!formData.value.images) formData.value.images = [];
      formData.value.images.push(res.full);
    } else {
      const notColorOptions = selectedOptions.value.filter(isColorOpt(options));

      variants.forEach(({ optionsIds }, idx) => {
        const isCandidate = (
          props.product.priceDependOnColor ? selectedOptions.value : notColorOptions
        ).every((id) => optionsIds.includes(id));
        if (isCandidate) {
          variants[idx].optionsInfo.images.push(res.full);
        }
      });
    }
  } finally {
    isImageUploading.value = false;
  }
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

  &.is-new {
    border-color: #409eff;
    box-shadow: 0 0 12px rgba(64, 158, 255, 0.35);
  }
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

.deleteButton {
  padding: 15px;
  box-sizing: border-box;
  border: 1px solid #2c2c2c;
  border-radius: 8px;
  opacity: 0.9;
  cursor: pointer;
  background-color: white;
  min-width: 40px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icoDelete {
  background-image: url(/icons/delete.svg);
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width: 20px;
  height: 20px;
}

.image-container {
  position: relative;
  width: 250px;
  height: 250px;
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
