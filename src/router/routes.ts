import { RouteRecordRaw } from 'vue-router';
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/main'
  },
  {
    name: 'main',
    path: '/main',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/main/dashboard'
      },
      {
        path: 'dashboard',
        component: () => import('pages/dashboard/DashboardPage.vue'),
        name: 'dashboard'
      }
    ],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    name: 'auth',
    children: [
      {
        path: 'login',
        component: () => import('pages/auth/LoginPage.vue'),
        name: 'login'
      },
      {
        path: '',
        redirect: '/auth/login'
      }
    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

export default routes;
