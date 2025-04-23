import { RouteRecordRaw } from 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
  }
}
export const devEnv = import.meta.env.DEV;
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: devEnv ? '/main' : '/auth/login',
  },
  {
    name: 'main',
    path: '/main',
    component: () => import('layouts/PrivateLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '/main',
        redirect: devEnv ? 'auth/login' : '/auth/login',
      },
      {
        path: 'home',
        name: 'home',
        component: () => import('pages/home/HomePage.vue'),
      },
    ],
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/auth/LoginPage.vue'),
      },
      {
        path: '/auth',
        redirect: '/auth/login',
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
