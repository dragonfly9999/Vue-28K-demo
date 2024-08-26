/* eslint-disable */

interface ImportMetaEnv {
  readonly VITE_API_BASE: string
  readonly VITE_ORDER_WS: string
  readonly VITE_CHAT_WS: string
}

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}
