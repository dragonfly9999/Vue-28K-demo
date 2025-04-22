import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { storageHelper } from 'src/utils/foragePkg';

export const useThemeStore = defineStore('theme', () => {
  const defaultIsDark = storageHelper<boolean>('isDark').getItem() ?? false;
  const isDark = ref<boolean>(defaultIsDark);

  const toggleTheme = () => {
    isDark.value = !isDark.value;
  };

  // set themes
  watch(isDark, (val) => {
    storageHelper<boolean>('isDark').setItem(val);
  });

  return {
    isDark,
    toggleTheme,
  };
});
