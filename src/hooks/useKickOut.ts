/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLiveStore, useThirdStore, useOrderStore } from 'src/stores';
import { forage } from 'src/utils/foragePkg';
import { useStorage } from 'vue3-storage';

export default  {
  clean: () => {
    // 首先清除 forage 避免異步
    forage().clear(() => {
      // 清除 store清除 store
      localStorage.clear();
      useLiveStore().cleanLiveOrders();
      useThirdStore().resetThirdStore();
      useOrderStore().resetOrderStore();
      useStorage().clearStorageSync();

      // 再登入介面重整時清除 cookie
      const cookies = document.cookie.split('; ');
      for (const cookie of cookies) {
        const [name, _] = cookie.split('=');
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
      }
      if ('caches' in window) {
        caches.keys().then((cacheNames) => {
          cacheNames.forEach((cacheName) => {
            caches.delete(cacheName);
          });
        });
      }

    })
  },
  redirect: () => {
    window.location.href = '/';
  }
}
