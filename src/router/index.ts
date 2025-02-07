import { route } from 'quasar/wrappers';
import { storageHelper } from 'src/utils/foragePkg';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router';

import routes from './routes';

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
      const loginSession = storageHelper('login_session').getItem()
      if (!!loginSession) {
        next();
      } else {
        next({name: 'login'});
      }
    } else {
      next();
    }
  });

  return Router;
});
