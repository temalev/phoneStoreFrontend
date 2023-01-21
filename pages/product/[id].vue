<template>
  <div class="mainProduct">{{ api.category }}</div>
</template>
<script setup>
import { useApi } from '~/stores/api';

const api = useApi();
</script>
<style scoped>
.mainProduct {
  margin-top: 70px;
}
</style>
