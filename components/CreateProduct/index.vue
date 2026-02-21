<template>
  <div class="createProduct">
    <el-steps
      :active="currentStep"
      finish-status="success"
      process-status="process"
      class="steps"
      align-center
    >
      <el-step title="Основная информация" />
      <el-step title="Загрузка изображений" />
    </el-steps>

    <!-- Шаг 1: Основная информация -->
    <div v-if="currentStep === 0" class="step-content">
      <el-form
        ref="formRef"
        :model="productData"
        :rules="rules"
        label-width="140px"
        class="product-form"
      >
      <el-form-item label="Категория" prop="categoryUUID">
        <el-select
          v-model="productData.categoryUUID"
          value-key="uuid"
          placeholder="Выберите категорию"
          style="width: 100%"
          @change="() => formRef?.clearValidate('categoryUUID')"
        >
    <el-option
      v-for="item in (api.categories || [])"
      :key="item.uuid"
      :label="item?.name"
      :value="item.uuid"
    />
  </el-select>
      </el-form-item>

      <el-form-item label="Название" prop="name">
        <el-input
          v-model="productData.name"
        placeholder="Название товара"
          @input="() => formRef?.clearValidate('name')"
        />
      </el-form-item>

      <el-form-item label="Описание" prop="description">
        <el-input
          v-model="productData.description"
          type="textarea"
          :rows="3"
        placeholder="Описание товара"
          @input="() => formRef?.clearValidate('description')"
        />
      </el-form-item>

      <el-form-item label="Цена" prop="price">
        <el-input-number
          v-model="productData.price"
        placeholder="Цена"
          :min="0"
          :precision="0"
          :controls="false"
          style="width: 100px"
          @change="() => formRef?.clearValidate('price')"
        />
      </el-form-item>

      <el-form-item label="Сортировка" prop="sortValue">
        <el-input-number
          v-model="productData.sortValue"
          placeholder="Сортировка"
          :min="1"
          :max="100"
          style="width: 140px"
        />
      </el-form-item>

      <el-form-item label="Опции">
        <div class="options-container">
          <div
            v-for="(option, optionIndex) in options"
            :key="option.id"
            class="option-card"
          >
            <div class="option-header">
              <el-input
                v-model="option.name"
                placeholder="Название опции (например: объем памяти, цвет)"
                style="flex: 1"
              />
              <el-select
                v-model="option.type"
                style="width: 150px; margin-left: 8px"
                @change="(val) => updateOptionType(optionIndex, val)"
              >
                <el-option label="Список" value="list" />
                <el-option label="Цвет" value="color" />
              </el-select>
              <el-button
                :icon="Delete"
                circle
                type="danger"
                @click="removeOption(optionIndex)"
                style="margin-left: 8px"
              />
            </div>

            <div class="option-items">
              <div
                v-for="(item, itemIndex) in (option.items || [])"
                :key="item?.id || itemIndex"
                class="option-item"
              >
                <div v-if="item" style="flex: 1">
                  <el-input
                    v-if="option.type === 'list'"
                    v-model="item.name"
                    placeholder="Значение (например: 12/256 ГБ)"
                    @input="item.value = item?.name"
                  />
                  <el-input
                    v-else
                    v-model="item.name"
                    placeholder="Название цвета"
                  >
           <template #prepend>
                      <input
                        class="picker"
                        type="color"
                        v-model="item.value"
                      />
          </template>
          </el-input>
                </div>
                <el-button
                  v-if="item"
                  :icon="Delete"
                  circle
                  type="danger"
                  size="small"
                  @click="removeOptionItem(optionIndex, itemIndex)"
                  style="margin-left: 8px"
                />
              </div>
              <el-button
                :icon="Plus"
                round
                size="small"
                @click="addOptionItem(optionIndex)"
                style="margin-top: 8px"
              >
                Добавить элемент
              </el-button>
            </div>
          </div>

          <el-button
            :icon="Plus"
            round
            @click="addOption"
            style="margin-top: 12px"
          >
            Добавить опцию
          </el-button>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="nextStep"
        >
          Далее
        </el-button>
      </el-form-item>
      </el-form>
    </div>

    <!-- Шаг 2: Загрузка изображений -->
    <div v-if="currentStep === 1" class="step-content">
      <!-- Если нет опций, загружаем общее изображение -->
      <div v-if="variants.length === 0" class="general-image-upload">
        <h3 class="variants-title">Загрузите общее изображение продукта:</h3>
        <div class="general-image-container">
          <div v-if="generalImage" class="general-image-preview">
            <img :src="generalImage" alt="Preview" />
            <el-button
              :icon="Delete"
              circle
              type="danger"
              size="small"
              @click="removeGeneralImage"
              class="remove-image-btn"
            />
          </div>
          <div
            v-else
            class="general-dropzone-wrapper"
            @drop.prevent="(e) => handleGeneralDrop(e)"
            @dragover.prevent
            @dragenter.prevent
          >
            <label for="dropZone-general"></label>
            <input
              id="dropZone-general"
              type="file"
              name="file"
              class="dragZone"
              accept="image/*"
              @change="handleGeneralFileSelect"
            />
          </div>
        </div>
      </div>

      <!-- Если есть варианты, загружаем изображения для каждого -->
      <div v-else class="variants-container">
        <h3 class="variants-title">Загрузите изображения для каждого варианта:</h3>
        <div class="variants-grid">
          <div
            v-for="(variant, index) in variants"
            :key="variant.id"
            class="variant-card"
          >
            <div class="variant-info">
              <div class="variant-options">
                <span
                  v-for="(optionId, optIdx) in variant.optionsIds"
                  :key="optIdx"
                  class="variant-option-tag"
                >
                  {{ getOptionItemName(optionId) }}
                </span>
              </div>
              <div
                v-if="getColorFromVariant(variant)"
                class="color-preview"
                :style="{ backgroundColor: getColorFromVariant(variant) }"
              />
            </div>
            <div class="variant-image-upload">
              <div v-if="variant.image" class="variant-image-preview">
                <img :src="variant.image" alt="Preview" />
                <el-button
                  :icon="Delete"
                  circle
                  type="danger"
                  size="small"
                  @click="removeVariantImage(index)"
                  class="remove-image-btn"
                />
              </div>
              <div
                class="variant-dropzone"
                @drop.prevent="(e) => handleDrop(e, index)"
                @dragover.prevent
                @dragenter.prevent
              >
                <label :for="`dropZone-${index}`"></label>
                <input
                  :id="`dropZone-${index}`"
                  type="file"
                  name="file"
                  class="dragZone"
                  accept="image/*"
                  @change="(e) => handleFileSelect(e, index)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="step-actions">
        <el-button @click="prevStep">Назад</el-button>
        <el-button
          type="primary"
          :loading="isLoading"
          @click="submitForm"
        >
          Создать продукт
        </el-button>
      </div>
    </div>

    <span class="confirm" v-if="createdProduct">
      {{ createdProduct?.name }} успешно создан
    </span>
  </div>
</template>

<script setup>
import { Plus, Delete } from '@element-plus/icons-vue';
import { ref, reactive, nextTick } from 'vue';
import { useApi } from '~/stores/api';
import { ElMessage } from 'element-plus';
import DropZone from '~/components/DropZone/index.vue';

const api = useApi();

const formRef = ref(null);
const isLoading = ref(false);
const options = ref([]);
const currentStep = ref(0);
const variants = ref([]);
const createdProduct = ref(null);
const generalImage = ref(null);
const generalImageUrl = ref(null);
const generalDropZoneRef = ref(null);

const productData = reactive({
  categoryUUID: null,
  name: '',
  description: '',
  price: null,
  sortValue: 1,
  images: [],
});

const rules = {
  categoryUUID: [
    {
      required: true,
      message: 'Пожалуйста, выберите категорию',
      trigger: 'change',
    },
  ],
  name: [
    {
      required: true,
      message: 'Пожалуйста, введите название товара',
      trigger: 'blur',
    },
    {
      min: 2,
      max: 200,
      message: 'Длина названия должна быть от 2 до 200 символов',
      trigger: 'blur',
    },
  ],
  price: [
    {
      required: true,
      message: 'Пожалуйста, введите цену',
      trigger: 'blur',
    },
    {
      type: 'number',
      min: 0,
      message: 'Цена должна быть положительным числом',
      trigger: 'blur',
    },
  ],
};

const addOption = () => {
  options.value.push({
    id: Date.now() + Math.random(),
    name: '',
    type: 'list',
    items: [],
  });
};

const removeOption = (index) => {
  options.value.splice(index, 1);
};

const addOptionItem = (optionIndex) => {
  const option = options.value[optionIndex];
  const newId = Date.now() + Math.random();
  options.value[optionIndex].items.push({
    id: newId,
    type: option.type,
    name: '',
    value: option.type === 'color' ? '#000000' : '',
  });
};

const removeOptionItem = (optionIndex, itemIndex) => {
  options.value[optionIndex].items.splice(itemIndex, 1);
};

const updateOptionType = (optionIndex, newType) => {
  const option = options.value[optionIndex];

  if (newType === 'color' && !option?.name) {
    options.value[optionIndex].name = 'Цвет';
  }

  option.items.forEach((item, index) => {
    options.value[optionIndex].items[index].type = newType;
    if (newType === 'color' && !item.value) {
      options.value[optionIndex].items[index].value = '#000000';
    } else if (newType === 'list') {
      options.value[optionIndex].items[index].value = item.name || '';
    }
  });
};

// Генерация всех комбинаций опций (декартово произведение)
const generateVariants = () => {
  if (options.value.length === 0) {
    variants.value = [];
    return;
  }

  // Получаем все опции с их элементами
  const optionArrays = options.value
    .filter((opt) => opt.items.length > 0)
    .map((opt) => opt.items.map((item) => ({
      id: item.id,
      name: item.name,
      value: item.value || item.name,
      type: item.type,
    })));

  if (optionArrays.length === 0) {
    variants.value = [];
    return;
  }

  // Функция для генерации декартова произведения
  const cartesianProduct = (arrays) => arrays.reduce((acc, curr) => {
    const result = [];
    acc.forEach((accItem) => {
      curr.forEach((currItem) => {
        result.push([...accItem, currItem]);
      });
    });
    return result;
  }, [[]]);

  const combinations = cartesianProduct(optionArrays);
  variants.value = combinations.map((combination, index) => ({
    id: Date.now() + index,
    optionsIds: combination.map((item) => item.id),
    optionsInfo: {
      price: productData.price || 0,
      images: [],
      oldPrice: 0,
    },
    image: null,
    imageFile: null,
    uploadedImageUrl: null,
  }));
};

const nextStep = async () => {
  if (!formRef.value) return;

  try {
    // Очищаем предыдущие ошибки валидации перед повторной проверкой
    formRef.value.clearValidate();
    await formRef.value.validate();

    // Если есть опции, проверяем их заполненность
    if (options.value.length > 0) {
      // Проверяем, что все опции заполнены
      const hasEmptyOptions = options.value.some((opt) => !opt.name || opt.items.length === 0);
      if (hasEmptyOptions) {
        ElMessage.warning('Пожалуйста, заполните все опции или удалите пустые');
        return;
      }

      // Проверяем, что все элементы опций заполнены
      const hasEmptyItems = options.value.some((opt) => opt.items.some((item) => !item.name));
      if (hasEmptyItems) {
        ElMessage.warning('Пожалуйста, заполните все элементы опций');
        return;
      }
    }

    // Генерируем варианты
    generateVariants();

    currentStep.value = 1;
  } catch (error) {
    ElMessage.error('Пожалуйста, заполните все обязательные поля');
  }
};

const prevStep = () => {
  currentStep.value = 0;
};

const getOptionItemName = (itemId) => {
  const foundOption = options.value.find((option) => {
    const item = option.items.find((i) => i.id === itemId);
    return item;
  });
  if (foundOption) {
    const item = foundOption.items.find((i) => i.id === itemId);
    return item ? item.name : '';
  }
  return '';
};

const getColorFromVariant = (variant) => {
  const foundItem = variant.optionsIds
    .map((optionId) => {
      const foundOption = options.value.find((option) => {
        const item = option.items.find((i) => i.id === optionId && i.type === 'color');
        return item;
      });
      if (foundOption) {
        return foundOption.items.find((i) => i.id === optionId && i.type === 'color');
      }
      return null;
    })
    .find((item) => item && item.value);
  return foundItem ? foundItem.value : null;
};

const handleFileUpload = async (file, variantIndex) => {
  const variant = variants.value[variantIndex];

  // Проверяем, не загружено ли уже изображение
  if (variant.image) {
    ElMessage.warning('Для этого варианта уже загружено изображение. Удалите его перед загрузкой нового.');
    return;
  }

  // Создаем превью
  variant.image = URL.createObjectURL(file);
  variant.imageFile = file;

  // Загружаем изображение на сервер
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.uploadImg(formData);
    variant.uploadedImageUrl = res.full;
    ElMessage.success('Изображение успешно загружено');
  } catch (error) {
    ElMessage.error('Ошибка при загрузке изображения');
    // Удаляем превью при ошибке
    if (variant.image) {
      URL.revokeObjectURL(variant.image);
    }
    variant.image = null;
    variant.imageFile = null;
  }
};

const handleDrop = (event, variantIndex) => {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (file) {
    handleFileUpload(file, variantIndex);
  }
};

const handleFileSelect = (event, variantIndex) => {
  const fileInput = document.querySelector(`#dropZone-${variantIndex}`);
  if (fileInput && fileInput.files && fileInput.files[0]) {
    // Проверяем, не загружено ли уже изображение для этого варианта
    const variant = variants.value[variantIndex];
    if (variant.image) {
      ElMessage.warning('Для этого варианта уже загружено изображение. Удалите его перед загрузкой нового.');
      return;
    }
    handleFileUpload(fileInput.files[0], variantIndex);
  }
};

const handleGeneralImageUpload = async (file) => {
  // Создаем превью
  generalImage.value = URL.createObjectURL(file);

  // Загружаем изображение на сервер
  try {
    const formData = new FormData();
    formData.append('file', file);
  const res = await api.uploadImg(formData);
  console.log(res);
  
    generalImageUrl.value = res.full;
    ElMessage.success('Изображение успешно загружено');
  } catch (error) {
    ElMessage.error('Ошибка при загрузке изображения');
    // Удаляем превью при ошибке
    if (generalImage.value) {
      URL.revokeObjectURL(generalImage.value);
    }
    generalImage.value = null;
  }
};

const handleGeneralDrop = (event) => {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (file) {
    if (generalImage.value) {
      ElMessage.warning('Общее изображение уже загружено. Удалите его перед загрузкой нового.');
      return;
    }
    handleGeneralImageUpload(file);
  }
};

const handleGeneralFileSelect = (event) => {
  const fileInput = event.target;
  if (fileInput && fileInput.files && fileInput.files[0]) {
    if (generalImage.value) {
      ElMessage.warning('Общее изображение уже загружено. Удалите его перед загрузкой нового.');
      return;
    }
    handleGeneralImageUpload(fileInput.files[0]);
  }
};

const removeGeneralImage = () => {
  if (generalImage.value) {
    URL.revokeObjectURL(generalImage.value);
  }
  generalImage.value = null;
  generalImageUrl.value = null;
};

const removeVariantImage = (variantIndex) => {
  const variant = variants.value[variantIndex];
  if (variant.image) {
    URL.revokeObjectURL(variant.image);
  }
  variant.image = null;
  variant.imageFile = null;
  variant.uploadedImageUrl = null;
};

const submitForm = async () => {
  isLoading.value = true;

  console.log(generalImageUrl.value);
  

  try {
    // Подготовка данных для отправки
    const submitData = {
      ...productData,
      images: generalImageUrl.value ? [generalImageUrl.value] : [],
      options: options.value.length > 0 ? options.value.map((option) => ({
        name: option.name,
        type: option.type,
        items: option.items.map((item) => ({
          id: item.id,
          type: item.type,
          name: item.name,
          value: item.value || item.name,
        })),
      })) : [],
      variants: variants.value.length > 0 ? variants.value.map((variant) => ({
        id: variant.id,
        optionsIds: variant.optionsIds,
        optionsInfo: {
          price: variant.optionsInfo.price,
          images: variant.uploadedImageUrl ? [variant.uploadedImageUrl] : [],
          oldPrice: variant.optionsInfo.oldPrice,
        },
        isDefault: false,
      })) : [],
    };

    const res = await api.createdProduct(submitData);

    if (res) {
  createdProduct.value = res;
      ElMessage.success('Продукт успешно создан');

      // Сброс формы
      if (formRef.value) {
        formRef.value.resetFields();
      }
      options.value = [];
      variants.value = [];
      currentStep.value = 0;
      generalImage.value = null;
      generalImageUrl.value = null;
    } else {
      ElMessage.error('Ошибка при создании продукта');
    }
  } catch (error) {
    ElMessage.error(error.message || 'Ошибка при создании продукта');
  } finally {
  isLoading.value = false;
  }
};

// eslint-disable-next-line no-undef
onMounted(() => {
  api.getCategories();
});
</script>

<style scoped lang="scss">
.createProduct {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 12px 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  img {
    border-radius: 32px;
    object-fit: cover;
  }

  .product-form {
    width: 100%;
    max-width: 600px;
  }

  .steps {
    width: 100%;
    max-width: 600px;
    margin-bottom: 30px;
  }

  .step-content {
    width: 100%;
    max-width: 800px;
  }

  .options-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;

    .option-card {
      padding: 16px;
      border: 1px solid #dcdfe6;
      border-radius: 8px;
      background: #fafafa;

      .option-header {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
      }

      .option-items {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 12px;

        .option-item {
          display: flex;
          align-items: flex-start;
    gap: 8px;
          width: 100%;
        }
      }
    }
  }

  .general-image-upload {
    width: 100%;

    .variants-title {
      margin-bottom: 20px;
      font-size: 18px;
      font-weight: 500;
    }

    .general-image-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 300px;

      .general-image-preview {
        position: relative;
        max-width: 400px;
        max-height: 400px;

        img {
          max-width: 100%;
          max-height: 400px;
          object-fit: contain;
          border-radius: 8px;
        }

        .remove-image-btn {
          position: absolute;
          top: 8px;
          right: 8px;
        }
      }

      .general-dropzone-wrapper {
        width: 200px;
        height: 200px;
        border: 1px solid #eee;
        border-radius: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        box-sizing: border-box;
        cursor: pointer;

        label {
          background-image: url(/icons/plus.svg);
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
          width: 60px;
          height: 60px;
          opacity: 0.2;
          cursor: pointer;
          transition: 0.2s;

          &:hover {
            opacity: 0.5;
          }
        }

        input {
          display: none;
        }
      }
    }
  }

  .variants-container {
    width: 100%;

    .variants-title {
      margin-bottom: 20px;
      font-size: 18px;
      font-weight: 500;
    }

    .variants-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 20px;

      .variant-card {
        padding: 16px;
        border: 1px solid #dcdfe6;
        border-radius: 8px;
        background: #fafafa;
  display: flex;
  flex-direction: column;
  gap: 12px;

        .variant-info {
          display: flex;
          flex-direction: column;
          gap: 8px;

          .variant-options {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;

            .variant-option-tag {
              padding: 4px 8px;
              background: #e4e7ed;
              border-radius: 4px;
              font-size: 12px;
            }
          }

          .color-preview {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            border: 1px solid #dcdfe6;
          }
        }

        .variant-image-upload {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 150px;
          border: 2px dashed #dcdfe6;
          border-radius: 8px;
          position: relative;

          .variant-image-preview {
            position: relative;
  width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
              max-width: 100%;
              max-height: 150px;
              object-fit: contain;
              border-radius: 8px;
            }

            .remove-image-btn {
              position: absolute;
              top: 8px;
              right: 8px;
            }
          }

          .variant-dropzone {
            width: 100%;
            height: 100%;
  display: flex;
  align-items: center;
            justify-content: center;
            border: 1px solid #eee;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.2s;

            &:hover {
              background-color: #f5f7fa;
            }

            label {
              background-image: url(/icons/plus.svg);
              background-size: contain;
              background-position: center;
              background-repeat: no-repeat;
              width: 60px;
              height: 60px;
              opacity: 0.2;
              cursor: pointer;
              transition: 0.2s;

              &:hover {
                opacity: 0.5;
              }
            }

            input {
              display: none;
            }
          }
        }
      }
    }
  }

  .step-actions {
    display: flex;
    justify-content: flex-end;
  gap: 12px;
    margin-top: 20px;
  }
}

.confirm {
  color: rgb(37, 186, 37);
  font-weight: 500;
}

.picker {
  appearance: none;
  height: 32px;
  width: 60px;
  border: 1px solid #c0c4cce5;
  cursor: pointer;
  border-radius: 4px;
  padding: 0;
  background: none;

  &::-webkit-color-swatch {
    border: none;
    border-radius: 4px;
  }

  &::-moz-color-swatch {
    border: none;
    border-radius: 4px;
  }
}

::v-deep {
  .el-input-group__append {
    padding-right: 0;
  }

  .el-input-group__prepend {
  padding: 0;
    border: none;
  }

  .el-form-item {
    margin-bottom: 20px;
  }

  .el-form-item__label {
    font-weight: 500;
  }
}
</style>
