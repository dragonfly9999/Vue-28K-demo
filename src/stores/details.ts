import { defineStore } from 'pinia';
import { RecordDetail } from 'src/pages/trade/api';

type TransactionDetailsObj = {
  [token: string]: RecordDetail;
}

export const useDetailsStore = defineStore('details', () => {
  const transaction:TransactionDetailsObj = {};


  return {
    transaction,
  }
});
