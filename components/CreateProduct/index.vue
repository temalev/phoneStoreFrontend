<template>
  <div class="createProduct">
    <DropZone v-if="!urlFile" @drop.prevent="drop" @change="selectedFile" />
    <img v-if="urlFile" :src="urlFile" alt="" width="250" height="250" />
    <DropList class="mt-5" :data="api.categories" @change="onSelect" />
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
    <!-- <div class="addOption">
      <div class="headerAddOption">
        <h2>Добавьте опции</h2>
        <CustomButton @click="opts += 1" type="plus" />
      </div>

      <AddOption @change="val => options = val" />
    </div> -->
    <CustomButton
      :isLoading="isLoading"
      name="Создать продукт"
      @click="createProduct"
    />
    <span class="confirm" v-if="createdProduct">{{ createdProduct.name }} успешно создан</span>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useApi } from '~/stores/api';

const api = useApi();

const opts = ref(0);
const isLoading = ref(false);
const colors = ref([
  {
    id: 1,
    color: '#333',
  },
  {
    id: 2,
    color: '#eee',
  },
  {
    id: 3,
    color: '#5t5t5t',
  },
]);
const options = ref(null);
const uploadedImgSrc = ref(null);

const dropzoneFile = ref({ url: null, file: null });
const urlFile = ref(null);
const createdProduct = ref(null)

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

const createProduct = async () => {
  isLoading.value = true;
  productData.value.images.push(uploadedImgSrc.value);
  const res = await api.createdProduct(productData.value);
  createdProduct.value = res
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
  padding: 22px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  img {
    border-radius: 32px;
    object-fit: cover;
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
</style>
