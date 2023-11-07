<template>
  <div class="createProduct">
    <DropZone v-if="!urlFile" @drop.prevent="drop" @change="selectedFile" />
    <img
      v-if="urlFile"
      :src="urlFile"
      alt=""
      width="200"
      height="200"
      style="flex-shrink: 0; box-sizing: border-box"
    />
    <div class="inputs">
      <!-- <DropList class="mt-5" :data="api.categories" @change="onSelect" /> -->
      <!-- {{getObjFromUuid(productData?.categoryUUID, api.categories).name}} -->
      <el-select v-model="productData.categoryUUID" value-key="uuid" class="m-2" placeholder="Select">
    <el-option
      v-for="item in api.categories"
      :key="item.uuid"
      :label="item.name"
      :value="item"
    />
  </el-select>
      <Input
        @inputValue="(val) => (productData.name = val)"
        placeholder="Название товара"
      />
      <Input
        @inputValue="(val) => (productData.description = val)"
        placeholder="Описание товара"
      />
      <Input
        @inputValue="(val) => (productData.price = val)"
        placeholder="Цена"
        type="number"
      />
      <div class="d-flex-column w100 gap-2">
        <span>Цвета</span>
        <div class="d-flex-column align-flex-start gap-3">
          <div
            class="d-flex align-center gap-2"
            v-for="color in colors"
            :key="color.id"
          >
          <el-input v-model="color.name" placeholder="Название цвета">
            <template #append>
              <el-input
                v-model="color.price"
                placeholder="Стоимость"
                style="width: 100px;"
                :formatter="(value) => `₽ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '\.')"
                :parser="(value) => value.replace(/\₽\s?|(\.*)/g, '')"
              />
            </template>
           <template #prepend>
            <input class='picker' type="color" id="body" name="body" value="color.value" />
          </template>
          </el-input>
          </div>
          <el-button
            :icon="Plus"
            round
            @click="colors.push({ id: colors.length + 1, value: '', name: '' })"
          />
        </div>
      </div>
    </div>

    <CustomButton
      :isLoading="isLoading"
      name="Создать продукт"
      @click="createProduct"
    />
    <span class="confirm" v-if="createdProduct"
      >{{ createdProduct.name }} успешно создан</span
    >
  </div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue';
import { ref } from 'vue';
import { useApi } from '~/stores/api';

const api = useApi();

const opts = ref(0);
const isLoading = ref(false);
const colors = ref([]);
const options = ref(null);
const uploadedImgSrc = ref(null);

const dropzoneFile = ref({ url: null, file: null });
const urlFile = ref(null);
const createdProduct = ref(null);

const productData = ref({ images: [] });

const drop = (event) => {
  event.preventDefault();
  // eslint-disable-next-line prefer-destructuring
  dropzoneFile.value.url = event.dataTransfer.files[0];
  // eslint-disable-next-line prefer-destructuring
  urlFile.value = URL.createObjectURL(dropzoneFile.value?.url);
};

const selectedFile = async () => {
  // eslint-disable-next-line prefer-destructuring
  dropzoneFile.value.url = document.querySelector('.dragZone').files[0];
  urlFile.value = URL.createObjectURL(dropzoneFile.value?.url);
  const formData = new FormData(); // Создаем экземпляр FormData
  formData.append('file', dropzoneFile.value.url);
  const res = await api.uploadImg(formData);
  uploadedImgSrc.value = res.full;
};

const onSelect = (val) => {
  productData.value.categoryUUID = val.uuid;
};

const getObjFromUuid = function(uuid, arr) {
  console.log(uuid);
  console.log(arr?.find((el) => el.uuid === uuid));
 return arr?.find((el) => el.uuid === uuid);
};

const createProduct = async () => {
  isLoading.value = true;
  productData.value.images.push(uploadedImgSrc.value);
  const res = await api.createdProduct(productData.value);
  createdProduct.value = res;
  isLoading.value = false;
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
  gap: 12px;
  padding: 12px 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  img {
    border-radius: 32px;
    object-fit: cover;
  }

  .inputs {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    overflow: auto;
  }
}

.addOption {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.headerAddOption {
  display: flex;
  align-items: center;
  gap: 12px;
}

.confirm {
  color: rgb(37, 186, 37);
}

.picker {
  appearance: none;
  height: 32px;
  width: 60px;
  border: 1px solid #c0c4cce5;
  cursor: pointer;
  &::-webkit-color-swatch {
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
}
}

</style>
