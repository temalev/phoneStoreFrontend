<template>
  <div class="createProduct">
    <DropZone v-if="!urlFile" @drop.prevent="drop" @change="selectedFile" />
    <img v-if="urlFile" :src="urlFile" alt="" width="250" height="250" />
    <DropList :data="api.categories" @change="onSelect" />
    <Input @inputValue="(val) => (productData.name = val)" placeholder="Название товара" />
    <Input @inputValue="(val) => (productData.description = val)" placeholder="Описание товара" />
    <Input @inputValue="(val) => (productData.price = val)" placeholder="Цена" />
    <!-- <div class="addOption">
      <div class="headerAddOption">
        <h2>Добавьте опции</h2>
        <CustomButton @click="opts += 1" type="plus" />
      </div>

      <AddOption @change="val => options = val" />
    </div> -->
    <CustomButton name="Создать продукт" @click="createProduct" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useApi } from '~/stores/api';

const api = useApi();

const opts = ref(0);
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

const dropzoneFile = ref({ url: null, file: null });
const urlFile = ref(null);

const productData = ref({});

const drop = (event) => {
  event.preventDefault();
  // eslint-disable-next-line prefer-destructuring
  dropzoneFile.value.url = event.dataTransfer.files[0];
  // eslint-disable-next-line prefer-destructuring
  urlFile.value = URL.createObjectURL(dropzoneFile.value?.url);
};

const selectedFile = () => {
  // eslint-disable-next-line prefer-destructuring
  dropzoneFile.value.url = document.querySelector('.dragZone').files[0];
  urlFile.value = URL.createObjectURL(dropzoneFile.value?.url);
  const formData = new FormData(); // Создаем экземпляр FormData
  formData.append('file', dropzoneFile.value.url);
  api.uploadImg(formData);
};

const onSelect = (val) => {
  productData.value.categoryUUID = val.uuid;
};

const createProduct = () => {
  console.log(productData.value);
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
  // width: 300px;
  background-color: #fff;
  border: 1px solid #eee;
  box-shadow: 0 0 20px #949494;
  border-radius: 32px;

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
</style>
