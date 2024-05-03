import auth from './index/auth';
import kyc from './index/kyc';
import dashboard from './index/dashboard';
import transaction from './index/transaction';
import account from './index/account';
import main from './index/main';
import transfer from './index/transfer';
import chat from './index/chat';
import wallet from './index/wallet';
import error from './index/error';
import transaction_history from './index/transaction_history';
import countryCode from './index/countryCode';
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
  countryCode,
  chatName,
  transaction_history,
  buy,
  sell,
  rate,
  currency,
  warn,
  btn,
  isTwenty,
};
