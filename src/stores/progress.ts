import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProgressStore = defineStore('progress', () => {
  const progress = ref<Array<LiveOrder>>([]);
  const setProgress = (args: Array<LiveOrder>) => (progress.value = args);
  const addProgress = (arg: LiveOrder) => progress.value.push(arg);
  const getProgress = () => progress.value;

  return {
    setProgress,
    addProgress,
    getProgress
  };
});
