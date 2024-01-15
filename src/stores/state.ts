import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useStorage } from 'vue3-storage';
import { useAuto, useBalance, useRates } from './api';

export const useStateStore = defineStore('state', () => {
  //
  const currency = 'CNY';
  const isAgent = computed(() => useStorage().getStorageSync('isAgent'));
  // ##### request
  // auto
  const { data: auto, run: updateAuto, loading: loadMode } = useAuto(isAgent);

  // rates
  const onRatesSuccess: {
    [key: string]: (rates: RateRes | undefined) => void;
  } = {};
  const {
    data: balance,
    run: updateBalance,
    loading: balanceLoading,
    refresh: refreshBalance
  } = useBalance();
  const {
    data: rates,
    run: updateRates,
    loading: loadRates
  } = useRates({
    onSuccess: (res) => {
      Object.values(onRatesSuccess).forEach((onSuccess) => {
        onSuccess(res?.data);
      });
    }
  });

  // handler
  const updateState = () => {
    updateBalance({});
    updateRates({});
  };
  const getAuto = () => auto.value;
  const getBalance = () => balance.value;
  const getRates = () => rates.value;
  const getAutoLoad = () => loadMode.value;
  const getBalanceLoad = () => balanceLoading.value;
  const getRatesLoad = () => loadRates.value;
  return {
    updateAuto,
    updateState,
    getAuto,
    getBalance,
    getRates,
    getAutoLoad,
    getBalanceLoad,
    getRatesLoad,
    refreshBalance,
    currency,
    onRatesSuccess
  };
});
