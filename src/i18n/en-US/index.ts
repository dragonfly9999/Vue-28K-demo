// This is just an example,
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
// so you can safely delete all default props below

export default {
  name: 'English',
  locale: 'en-US',
  訊息: 'Message',
  交易進行中: 'Transaction in Progress',
  交易: 'Transaction',
  購買: 'Buy',
  出售: 'Sell',
  連線中: 'Connecting',
  返回: 'Back',
  確認: 'Confirm',
  kyc,
  auth,
  dashboard,
  transaction,
  account,
  main,
  transfer,
  chat,
  error,
  transaction_history,
  // 錢包wallet
  wallet,
  cancel,
  countryCode,
  success: 'Success',
  新增帳戶: 'Add Account',
  label,
  chatName,
  購買USDT: 'Buy USDT',
  buy,
  sell,
  開始配對: 'Start Matching',
  配對中: 'Matching in Progress',
  rate,
  currency,
  warn,
  btn,
  isTwenty,
};
