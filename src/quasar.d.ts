/// <reference types="@quasar/app-vite" />

interface OrderStatus {
  CreateDate: string;
  Currency: string;
  D1: number; // 匯率
  D2: number; // 金額
  D3: number; // 手續費
  D4: null; // 這啥?
  D5: null | number; // 這啥?
  Date: string;
  DeltaTime: number; // 經過毫秒
  MasterType: number;
  Order_StatusID: number;
  Order_TypeID: number;
  P1: string; // 銀行帳號
  P2: string; // 姓名
  P3: string; // 銀行名稱
  P4: string; // 所在省市
  P5: string; // 付款人資訊
  P6: null; // 這啥?
  Tx_HASH: string;
  UsdtAmt: number;
}

interface RecordDetail {
  MasterType: number;
  CreateDate: '2023.06.19 19:52:45';
  Date: '2023.06.19 19:52:45';
  Tx_HASH: '8xXYQ96G9AW56TY3WAS4C6YP15CU6NJF7369U9CA2V';
  UsdtAmt: number;
  Order_TypeID: number;
  P1: '123456789123456789';
  P2: '陈英文';
  P3: '建设银行';
  P4: '北京总行';
  P5: '許威利|西藏銀行|0000000000000016|拉薩';
  P6: null;
  D1: 7.2;
  D2: 8863.2;
  D3: 1.2; // 手續費比例
  D4: null;
  D5: null;
  Order_StatusID: number;
  DeltaTime: 5370;
  Currency: 'CNY';
  Adj: 0.0;
}

interface ChatRes {
  Message: string;
  Message_Role: number;
  Message_Type: number;
  Sysdate: string;
  SysID: number;
}

interface ExpiredOrder {
  MasterType: number;
  Date: string;
  D1: number; // 匯率
  D2: number; // 金額
  Order_StatusID: number;
  token: string;
  UsdtAmt: number;
}

interface OrderRecord {
  MasterType: number;
  Date: string;
  Tx_HASH: string;
  D1: number; // 匯率
  D2: number; // 金額
  UsdtAmt: number;
  Balance: number;
  P1: string; // 銀行帳號
  P2: string; // 姓名
  P3: string; // 銀行名稱
  P4: string; // 所在省市
  P5: string; // 會員資訊
  token: string;
}

type PendingOrder = {
  MasterType: number;
  Date: string;
  UsdtAmt: number;
  D1: number; // 匯率
  D2: number; // 金額
  Order_StatusID: number;
  token: string;
};

interface LiveOrder {
  Order_StatusID: number;
  MType: number;
  DeltaTime: number;
  UsdtAmt: number;
  D1: number; //匯率
  D2: number; // 金額
  CreateDate: string;
  P5: string; // 銀行資訊
  extraInfo: null | string; // 備註
  token: string; //
}
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
  isChat: boolean;
  order_token?: string;
  login_session: string;
};
