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
        path: '/main',
        redirect: import.meta.env.DEV ? '/main/account' : '/main/kyc'
      },
      {
        path: 'dashboard',
        component: () => import('pages/dashboard/DashboardPage.vue'),
        name: 'dashboard'
      },
      {
        path: 'transaction',
        component: () => import('layouts/TransactionLayout.vue'),
        name: 'transaction',
        children: [
          {
            path: 'buy',
            component: () => import('pages/transaction/buy/BuyPage.vue'),
            name: 'buy'
          },
          {
            path: 'sell',
            component: () => import('pages/transaction/sell/SellPage.vue'),
            name: 'sell'
          }
        ]
      },
      {
        path: 'transfer',
        component: () => import('pages/transfer/TransferPage.vue'),
        name: 'transfer'
      },
      {
        path: 'wallet',
        component: () => import('pages/wallet/WalletPage.vue'),
        name: 'wallet'
      },
      {
        path: 'history',
        component: () => import('pages/history/HistoryPage.vue'),
        name: 'history'
      },
      {
        path: 'account',
        component: () => import('pages/account/AccountPage.vue'),
        name: 'account'
      },
      {
        path: 'account_create',
        component: () => import('pages/account/CreatePage.vue'),
        name: 'account_create'
      },
      {
        path: 'kyc',
        component: () => import('pages/kyc/IndexPage.vue'),
        children: [
          {
            path: '',
            component: () => import('pages/kyc/KycList.vue'),
            name: 'kyc'
          },
          {
            path: 'create',
            component: () => import('pages/kyc/CreatePage.vue'),
            name: 'kyc_create'
          }
        ]
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
        path: '/auth',
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
