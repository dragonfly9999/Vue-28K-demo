import { defineStore } from 'pinia';
import  usePending  from './api/usePending';

export const usePendingStore = defineStore('pending', () => {
  const pendingInstant = usePending({});
  return {
    pendingInstant,
  };
});
