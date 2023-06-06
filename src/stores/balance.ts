import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useBalanceStore = defineStore('balance', () => {
  const balance = ref<BalanceRes>();
  const getBalance = () => balance.value;
  const setBalance = (args: BalanceRes) => (balance.value = args);
  return { getBalance, setBalance };
});
