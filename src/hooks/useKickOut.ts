/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLiveStore, useThirdStore, useOrderStore } from 'src/stores';
import { useStorage } from 'vue3-storage';

export default  {
  clean: () => {
    useLiveStore().cleanLiveOrders();
    useThirdStore().resetThirdStore();
    useOrderStore().resetOrderStore();
    // 再登入介面重整時清除 cookie
    const cookies = document.cookie.split('; ');

    for (const cookie of cookies) {
      const [name, _] = cookie.split('=');
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
    }
    useStorage().clearStorageSync();
  },
  redirect: () => {
    window.location.href = '/';
  }
}
