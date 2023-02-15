<template>
  <div class="createProduct">
    <DropZone v-if="!urlFile" @drop.prevent="drop" @change="selectedFile" />
    <img v-if="urlFile" :src="urlFile" alt="" width="250" height="250" />
    <DropList />
    <CustomInput @inputValue="(val) => (productData.name = val)" placeholder="Название товара" />
    <input type="color" name="" id="" />
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useApi } from '~/stores/api';

const api = useApi();

const dropzoneFile = ref(null);
const urlFile = ref(null);

const productData = ref({});

const drop = (event) => {
  // eslint-disable-next-line prefer-destructuring
  dropzoneFile.value = event.dataTransfer.files[0];
  urlFile.value = URL.createObjectURL(dropzoneFile.value);
};

const selectedFile = () => {
  // eslint-disable-next-line prefer-destructuring
  dropzoneFile.value = document.querySelector('.dragZone').files[0];
  urlFile.value = URL.createObjectURL(dropzoneFile.value);
};
</script>
<style scoped lang="scss">
.createProduct {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 12px;
  width: 300px;
  height: 400px;
  background-color: #fff;
  border: 1px solid #eee;
  box-shadow: 0 0 20px #949494;
  border-radius: 32px;

  img {
    border-radius: 32px;
    object-fit: cover;
  }
}
</style>
