import { RouteRecordRaw } from 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: import.meta.env.DEV ? '/main' : '/auth/login',
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
        redirect: import.meta.env.DEV ? 'auth/login' : '/auth/login',
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
