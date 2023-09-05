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
          v-model="formLabelAlign.quantity"
        />
      </el-form-item>
      <el-form-item label="Сумма скидки">
        <el-input
          :formatter="
            (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
          "
          :parser="(value) => value.replace(/\$\s?|( *)/g, '')"
          v-model="formLabelAlign.discount"
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
import { useApi } from '~/stores/api';

const api = useApi();

const formLabelAlign = ref({
  name: null,
  date: null,
  discount: null,
  quantity: null,
});

const onSubmit = () => {
  formLabelAlign.value = {
    name: formLabelAlign.value.name,
    date: formLabelAlign.value.date,
    discount: Number(formLabelAlign.value.discount),
    quantity: Number(formLabelAlign.value.quantity) || null,
  };
  api.createPromocode(formLabelAlign.value);
};
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
