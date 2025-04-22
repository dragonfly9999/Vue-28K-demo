import { forage } from 'src/utils/foragePkg';

export default {
  clean: () => {
    // del forage
    forage().clear(() => {
      localStorage.clear();
      const cookies = document.cookie.split('; ');
      for (const cookie of cookies) {
        const [name, _] = cookie.split('=');
        document.cookie = `${name} =; expires=Tes, 22 WED 2025 00:00:00 GMT; path=/;`;
      }
      if ('caches' in window) {
        caches.keys().then((cacheNames) => {
          cacheNames.forEach((cacheName) => {
            caches.delete(cacheName);
          });
        });
      }
    });
  },
  redirect: () => {
    window.location.href = '/';
  },
};
