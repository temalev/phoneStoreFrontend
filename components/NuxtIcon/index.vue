<template>
  <span class="nuxt-icon" :class="{ 'nuxt-icon--fill': !filled }" v-html="icon" />
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';

const props = withDefaults(
  defineProps<{
    name: string;
    filled?: boolean;
  }>(),
  { filled: false },
);

const icon = ref('');

watchEffect(async () => {
  try {
    const iconsImport = import.meta.glob('/icons/**/**.svg', {
      as: 'raw',
      eager: false,
    });
    const rawIcon = await iconsImport[`/icons/${props.name}.svg`]();
    icon.value = rawIcon;
  } catch {
    console.error(`[nuxt-icons] Icon '${props.name}' doesn't exist in '/icons'`);
  }
});
</script>

<style>
.nuxt-icon svg {
  width: 1em;
  height: 1em;
  margin-bottom: 0.125em;
  vertical-align: middle;
}
.nuxt-icon.nuxt-icon--fill,
.nuxt-icon.nuxt-icon--fill * {
  fill: currentColor !important;
}
</style>
