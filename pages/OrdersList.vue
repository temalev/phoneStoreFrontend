<template>
  <div class="orderList">
    <client-only>
      <el-table :data="api.newOrders" style="width: 100%" scrollable>
        <el-table-column sortable prop="fullName" label="ФИО" min-width="200px" />
        <el-table-column v-slot="{ row }" prop="items" label="Товары" min-width="320px">
          <div v-for="item in row.items" :key="item.uuid">
            {{ item.name }} - {{ item.count || 1 }} шт.
          </div>
        </el-table-column>
        <el-table-column
          sortable
          v-slot="{ row }"
          prop="createdAt"
          label="Дата заказа"
          width="100px"
        >
          {{ moment(row.createdAt).format('DD.MM.YYYY') }}
        </el-table-column>
        <el-table-column prop="deliveryMessage" label="Адрес" min-width="220px" />
        <el-table-column v-slot="{ row }" prop="items" label="Стоимость товаров" min-width="120px">
          {{ price(row.items) }}
        </el-table-column>
        <el-table-column
          v-slot="{ row }"
          align="center"
          prop="status"
          label="Статус"
        >
          <el-tag v-if="row.status === 2" class="ml-2" effect="dark" type="info"
            >Завершен</el-tag
          >
          <el-tag v-if="row.status === 1" class="ml-2" effect="dark"
            >В работе</el-tag
          >
          <el-tag
            v-if="row.status === 0"
            class="ml-2"
            effect="dark"
            type="success"
            >Новый заказ</el-tag
          >
        </el-table-column>
      </el-table>
    </client-only>
  </div>
</template>
<script setup>
import { useApi } from '~/stores/api';
import moment from 'moment';

const api = useApi();

const price = (items) => {
  const cost = items.reduce((prevValue, item) => prevValue + item.price, 0);
  return new Intl.NumberFormat('ru').format(cost);
};

// eslint-disable-next-line no-undef
onMounted(() => {
  api.getOrders();
});
</script>
<style scoped lang="scss">
.orderList {
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  margin-top: 100px;
}
</style>
