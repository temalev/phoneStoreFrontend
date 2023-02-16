<template>
  <div class="dropList">
    <div @click="activeList = !activeList" class="selectedItem">
      <span class="selectedName">
        <span v-if="!selected.name">Выберите категорию</span>
        {{ selected.name }}</span
      >
      <NuxtIcon class="ico" name="down" filled />
    </div>
    <div class="listContainer" :style="{ display: activeList ? 'flex' : '' }">
      <div
        v-for="list in api.categories"
        :key="list.uuid"
        @click="(selected.uuid = list.uuid), (selected.name = list.name), (activeList = false)"
        class="list"
      >
        {{ list?.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useApi } from '~/stores/api';

const api = useApi();

const activeList = ref(false);

const selected = ref({});
</script>

<style scoped lang="scss">
.dropList {
  width: 100%;
  position: relative;
  white-space: nowrap;
  // overflow: hidden;
}
.selectedItem {
  // position: relative;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  border: 1px solid #eee;
  padding: 8px;
  border-radius: 5px;
  background-color: #fff;
}

.listContainer {
  position: absolute;
  display: none;
  flex-direction: column;
  gap: 5px;
  border: 1px solid #eee;
  background-color: #fff;
  width: 100%;
  z-index: 22;
}

.ico {
  right: 0px;
  padding: 0 6px;
  margin: 0 1px;
  position: absolute;
  flex-shrink: 0;
  background-color: #fff;
}

.list {
  padding: 8px;
  background-color: #fff;

  transition: 0.2s;
  cursor: pointer;

  &:hover {
    background-color: #eee;
  }
}
</style>
