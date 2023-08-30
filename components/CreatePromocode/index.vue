<template>
  <div class="createPromocode">
    <h2>Создание промокода</h2>
    <el-form label-position="top" :model="formLabelAlign" className="mt-12">
      <el-form-item label="Промокод">
        <el-input v-model="formLabelAlign.name" />
      </el-form-item>
      <el-form-item label="Дата деактивации">
        <el-date-picker
          v-model="formLabelAlign.date"
          type="date"
          placeholder="Pick a date"
          clearable
        />
      </el-form-item>
      <el-form-item label="Количество">
        <el-input
          :formatter="
            (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
          "
          :parser="(value) => value.replace(/\$\s?|( *)/g, '')"
          v-model="formLabelAlign.count"
        />
      </el-form-item>
      <el-form-item label="Сумма скидки">
        <el-input
          :formatter="
            (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
          "
          :parser="(value) => value.replace(/\$\s?|( *)/g, '')"
          v-model="formLabelAlign.price"
        />
      </el-form-item>
      <el-form-item>
      <el-button type="primary" @click="onSubmit">Создать промокод</el-button>
    </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { ref } from 'vue';

const formLabelAlign = ref({
  name: null,
  region: null,
  type: null,
  date: null,
  price: null,
  count: null,
});
</script>
<style scoped lang="scss">
.createPromocode {
  position: relative;
}

::v-deep {
  .el-picker__popper .el-popper {
    z-index: 9999999999999999 !important;
  }
}
</style>
