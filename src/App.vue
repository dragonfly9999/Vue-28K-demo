<template>
  <suspense>
    <template #default>
      <router-view />
    </template>
    <template #fallback>
      <q-spinner-gears color="primary" size="50px" />
      <p>Đang tải...</p>
    </template>
  </suspense>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { onMounted, watch } from 'vue';
import { useThemeStore } from './stores';
import IconMini from 'src/assets/images/K28_Icon_mini.png';
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
