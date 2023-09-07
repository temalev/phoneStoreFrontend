<template>
  <div class="createPromocode">
    <Transition>
    <el-alert v-if="success" class="mb-4" title="success alert" type="success" effect="dark" />
  </Transition>
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
const emit = defineEmits(['close']);

const success = ref(false);

const formLabelAlign = ref({
  name: null,
  date: null,
  discount: null,
  quantity: null,
});

const onSubmit = async () => {
  formLabelAlign.value = {
    name: formLabelAlign.value.name,
    existsUp: formLabelAlign.value.date,
    discount: Number(formLabelAlign.value.discount),
    quantity: Number(formLabelAlign.value.quantity) || null,
  };
  const res = await api.createPromocode(formLabelAlign.value);
  if (res) {
    success.value = true;
    setTimeout(() => {
      success.value = false;
    }, 3000);
  }
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

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
