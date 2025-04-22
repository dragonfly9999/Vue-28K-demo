<template>
  <q-btn
    flat
    round
    dense
    icon="dark_mode"
    :color="themeStore.isDark ? 'yellow' : 'grey-8'"
    @click="toggleTheme"
    aria-label="check"
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
