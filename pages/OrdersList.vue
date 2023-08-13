<template>
  <div class="orderList">
    <client-only>
      <el-table :data="api.newOrders" style="width: 100%" scrollable>
        <el-table-column prop="fullName" label="ФИО" />
        <el-table-column v-slot="{ row }" prop="items" label="Товары">
          <div v-for="item in row.items" :key="item.uuid">{{ item.name }}</div>
        </el-table-column>
        <el-table-column prop="createdAt" label="Дата заказа" />
        <el-table-column prop="address" label="Адресс" />
        <!-- <el-table-column v-slot="{ row }" prop="items" label="Статус">
          {{ price(row.items) }}
        </el-table-column> -->
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
import { useApi } from "~/stores/api";

const api = useApi();

// const price = (items) => {
//   return items.map(el => )
// }

// eslint-disable-next-line no-undef
onMounted(() => {
  api.getOrders();
});
</script>
<style scoped lang="scss">
.orderList {
  box-sizing: border-box;
  width: 100%;
  margin-top: 100px;
}
</style>
