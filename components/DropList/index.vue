<template>
  <div class="dropList">
    <div @click="activeList = !activeList" class="selectedItem">
      <span class="selectedName">
        <span v-if="!selected.name">Выберите категорию</span>
        {{ selected.name }}</span
      >
      <NuxtIcon class="ico" :style="{transform: activeList ? 'rotate(180deg)' : ''}" name="down" filled />
    </div>
    <div class="listContainer" :style="{ display: activeList ? 'flex' : '' }">
      <div
        v-for="list in data"
        :key="list.uuid"
        @click="onActive(list.uuid, list.name)"
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

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['change']);

const activeList = ref(false);

const selected = ref({});

const onActive = (uuid, name) => {
  selected.value.uuid = uuid;
  selected.value.name = name;
  activeList.value = false;
  emit('change', selected.value);
};
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
  height: 170px;
  overflow: scroll;
  z-index: 22;
  box-sizing: border-box;
}

.ico {
  right: 0px;
  padding: 0 6px;
  margin: 0 1px;
  position: absolute;
  flex-shrink: 0;
  background-color: #fff;
  transition: .2s;
}

.list {
  padding: 8px;
  background-color: #fff;
  overflow: hidden;
  transition: 0.2s;
  cursor: pointer;
  height: 22px;
  display: flex;
  align-items: center;
  flex-shrink: 0;

  &:hover {
    background-color: #eee;
  }
}
</style>
