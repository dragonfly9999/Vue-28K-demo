import auth from './index/auth';
import kyc from './index/kyc';
import dashboard from './index/dashboard';
import transaction from './index/transaction';
import account from './index/account';
import main from './index/main';
import transfer from './index/transfer';
import chat from './index/chat';
import wallet from './index/wallet';
import cancel from './index/cancel';
import error from './index/error';
import transaction_history from './index/transaction_history';
import countryCode from './index/countryCode';
import label from './index/label';
import chatName from './index/chatName';
import buy from './index/buy';
import sell from './index/sell';
import rate from './index/rate';
import currency from './index/currency';
import warn from './index/warn';
import btn from './index/btn';
import isTwenty from './index/isTwenty';

export default {
  name: '中文',
  locale: 'ch-HK',
  訊息: '訊息',
  交易進行中: '交易進行中',
  交易: '交易',
  購買: '購買',
  出售: '出售',
  連線中: '連線中',
  返回: '返回',
  確認: '確認',
  kyc,
  auth,
  dashboard,
  transaction,
  account,
  main,
  transfer,
  chat,
  error,
  // 錢包wallet
  wallet,
  cancel,
  countryCode,
  success: '成功',
  新增帳戶: '新增帳戶',
  匯率: '匯率',
  沒有訂單: '沒有訂單',
  label,
  chatName,
  transaction_history,
  購買USDT: '購買USDT',
  buy,
  sell,
  開始配對: '開始配對',
  配對中: '配對中',
  rate,
  currency,
  warn,
  btn,
  isTwenty,
};
