<template>
  <div class="promocodesList">
    <client-only>
      <el-table :data="api.allPromocodes" style="width: 100%" scrollable v-loading="loading">
        <el-table-column sortable prop="name" label="Промокод" min-width="120px" />
        <!-- <el-table-column prop="deliveryMessage" label="Адрес" width="220px" /> -->
        <el-table-column sortable v-slot="{ row }" prop="items" label="Сумма скидки">
          {{ row.discount }}
        </el-table-column>
        <el-table-column
          v-slot="{ row }"
          align="center"
          prop="status"
          label="Статус"
          min-width="120"
        >
          <el-tag v-if="row.isDisabled" class="ml-2" effect="dark" type="info"
            >Не активный</el-tag
          >
          <el-tag v-else class="ml-2" effect="dark"
            >Активный</el-tag
          >
        </el-table-column>
        <el-table-column v-slot="{ row }" label="" width="120">
        <el-button
          link
          type="primary"
          size="small"
          @click.prevent="editPromocode(row)"
        >
          <span v-if="row.isDisabled">Активировать</span>
          <span v-else>Деактивировать</span>
        </el-button>
    </el-table-column>
      </el-table>
    </client-only>
  </div>
</template>
<script setup>
import { useApi } from '~/stores/api';
import { ref } from 'vue';
import moment from 'moment';

const api = useApi();

const loading = ref(false);

const editPromocode = (promocode) => {
  loading.value = true;
  const isDisabled = !promocode.isDisabled
  api.editPromocode(promocode.uuid, { isDisabled });
  setTimeout(() => {
    api.getAllPromocode();
    loading.value = false;
  }, 1000);


}

// eslint-disable-next-line no-undef
onMounted(() => {
  api.getAllPromocode();
});
</script>
<style scoped lang="scss">
.promocodesList {
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  margin-top: 100px;
}
</style>
