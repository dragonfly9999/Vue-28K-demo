import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useKeyStore = defineStore('key', () => {
  const down = ref<string>();
  const up = ref();

  const handleDown = (e: KeyboardEvent) => {
    down.value = e.key;
  };
  const handleUP = (e: KeyboardEvent) => {
    down.value = undefined;
    up.value = e.key;
  };
  const handelSet = () => {
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUP);
  };
  const handleRemove = () => {
    window.removeEventListener('keydown', handleDown);
    window.removeEventListener('keyup', handleUP);
  };
  const pressing = () => down.value;
  return { pressing, handelSet, handleRemove };
});
