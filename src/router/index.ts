import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router';

import routes from './routes';
import { useStorage } from 'vue3-storage';

const storage = useStorage();
export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE)
  });

  Router.beforeEach((to, _, next) => {
    if (to.meta.requiresAuth) {
      const loginSession = storage?.getStorageSync('login_session');
      if (!!loginSession) {
        next();
      } else {
        next('/auth');
      }
    } else {
      next();
    }
  });

  return Router;
});
