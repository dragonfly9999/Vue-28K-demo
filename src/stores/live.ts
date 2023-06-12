import { defineStore } from 'pinia';
import { ref } from 'vue';

enum MtTypeNum {
  Buy = 2,
  Sell = 1
}
enum OrderStatusNum {
  Matching = 31,
  Assigned = 33,
  Committed = 34,
  Appeal = 35,
  Complete = 1,
  Cancel = 99,
  TimeOut = 98
}

export const useLiveStore = defineStore('live', () => {
  const liveOrders = ref<Array<LiveOrder>>([]);

  const setOrders = (args: Array<LiveOrder>) => (liveOrders.value = args);
  const addOrders = (arg: LiveOrder) => liveOrders.value.push(arg);
  const getOrders = () => liveOrders.value;

  return {
    setOrders,
    addOrders,
    getOrders
  };
});
export { MtTypeNum, OrderStatusNum };
