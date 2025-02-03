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
  P6: string; // 備註
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
  Channel?: string | number; // 參考channel對照表，目前回傳為string避免錯誤在顯示時多加判斷
  Channel_ID: 1;
  CreateDate: string;
  Order_StatusID: number;
  D1: number; //匯率
  D2: number; // 金額
  DeltaTime: number;
  MType: number;
  P5: string; // 銀行資訊
  UsdtAmt: number;
  extraInfo: null | string; // 備註
  token: string; //
}


interface VirgilRes<DATA> {
  code: number;
  msg: string;
  data: DATA;
}


type UseProps<DATA = unknown, Params = unknown> = {
  onSuccess?: (res?: VirgilRes<DATA>, params?: [Params]) => void;
  onError?: (error?: Error) => void;
  onAfter?: (args?: [Params]) => void;
};
