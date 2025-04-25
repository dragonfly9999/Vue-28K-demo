import { defineStore } from 'pinia';

export const useSplashStore = defineStore('splash', {
  state: () => ({
    isSplashVisiable: true,
  }),
  actions: {
    hideSplash() {
      this.isSplashVisiable = false;
    },
  },
});
