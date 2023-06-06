/* eslint-disable */

// Forces TS to apply `@quasar/app-vite` augmentations of `quasar` package
// Removing this would break `quasar/wrappers` imports as those typings are declared
//  into `@quasar/app-vite`
// As a side effect, since `@quasar/app-vite` reference `quasar` to augment it,
//  this declaration also apply `quasar` own
//  augmentations (eg. adds `$q` into Vue component context)
/// <reference types="@quasar/app-vite" />

interface RateRes {
  RMB_BUY: string;
  RMB_SELL: string;
  TransferHandle: string;
  TransferHandle2: string;
}

interface BalanceRes {
  Real_Balance: number;
  Avb_Balance: number;
  AgtBalance: number;
  Lvl: number;
}

interface VirgilRes<DATA> {
  code: number;
  msg: string;
  data: DATA;
}

type WebsocketOptions = {
  reconnectEnabled: boolean;
  reconnectInterval: number;
};

