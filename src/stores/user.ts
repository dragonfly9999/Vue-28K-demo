import { defineStore } from 'pinia';
import { ref } from 'vue';

const useUserStore = defineStore('user', () => {
  const phone = ref<string>();
  const setPhone = (arg: string) => {
    phone.value = arg;
  };
  const getPhone = () => phone.value;
  return { getPhone, setPhone };
});

export { useUserStore };
