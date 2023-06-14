import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAccessyStore = defineStore('accessy', () => {
  const notify = ref(false);
  const hint = ref(true);
  const getAccess = () => {
    return { notify: notify.value, hint: hint.value };
  };
  return { notify, hint, getAccess };
});
