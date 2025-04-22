/* eslint-disable */

interface ImportMetaEnv {
  readonly VITE_API_BASE: string;
  readonly VITE_ORDER_K28: string;
  readonly VITE_CHAT_K28: string;
}

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}

type ValueOf<T> = T[keyof T];
type NOU = null | undefined;
type DevProps = {
  isTest?: boolean;
};
