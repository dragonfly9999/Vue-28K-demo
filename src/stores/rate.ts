import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useRateStore = defineStore('rate', () => {
  const rate = ref<RateRes>();
  const getRate = () => rate.value;
  const setRate = (arg: RateRes) => {
    rate.value = arg;
  };
  return {
    getRate,
    setRate
  };
});
