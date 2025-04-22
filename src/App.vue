<template>
  <suspense>
    <template #default>
      <router-view />
    </template>
    <template #fallback>
      <h1>Loading...</h1>
    </template>
  </suspense>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { onMounted, watch } from 'vue';
import { useThemeStore } from './stores';

const $q = useQuasar();
const themeStore = useThemeStore();
// App run
onMounted(() => {
  $q.dark.set(themeStore.isDark);
});

// toggle after run
watch(
  () => themeStore.isDark,
  (val) => {
    $q.dark.set(val);
  }
);
</script>
