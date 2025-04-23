<template>
  <q-btn
    flat
    round
    dense
    :icon="themeStore.isDark ? 'wb_sunny' : 'nights_stay'"
    :color="themeStore.isDark ? 'white' : 'deep-purple'"
    @click="toggleTheme"
    aria-label="check"
    class="my-icon-btn"
  />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useThemeStore } from '../stores';
const $q = useQuasar();
const themeStore = useThemeStore();

const toggleTheme = () => {
  themeStore.toggleTheme();
};
</script>

<style scoped>
.my-icon-btn {
  transition: background-color 0.3s ease;
}

.my-icon-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
