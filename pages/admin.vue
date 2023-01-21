<template>
  <div class="mainAdmin">{{ determiningWidth.message }}</div>
</template>
<script setup lang="ts">
import { useDetermininingWidth } from '~/stores/determiningWidth';

const determiningWidth = useDetermininingWidth();
</script>
<style scoped>
.mainAdmin {
  margin-top: 70px;
}
</style>
