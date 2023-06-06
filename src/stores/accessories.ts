import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAccessyStore = defineStore('accessy', () => {
  const notify = ref(false);
  const hint = ref(false);
  const auto = ref(false);

  return { notify, hint, auto };
});
