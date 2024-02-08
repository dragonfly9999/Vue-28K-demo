import { defineStore } from 'pinia';
import { thousandTool } from 'src/utils/NumberTool';
import { reactive } from 'vue';
import { useAuto, useBalance, useRates } from './api';
import { RateRes } from './api/useRates';

export const useStateStore = defineStore('state', () => {
  //
  const currency = 'CNY';
  const formatRates = reactive({
    buy: '',
    sell: '',
  });
  const formatBalances = reactive({
    available: '',
    actual: '',
    maximum: ''
  });
  // ##### request
  const autoModeRequest = useAuto({});
  // rates
  const onRatesSuccess: {
    [key: string]: (rates: RateRes | undefined) => void;
  } = {};
  const ratesRequest = useRates({
    onSuccess: (res) => {
      const rateInfo = res?.data;
      Object.values(onRatesSuccess).forEach((onSuccess) => {
        onSuccess(rateInfo);
      });

      formatRates.buy = thousandTool(rateInfo?.RMB_BUY, currency)
      formatRates.sell = thousandTool(rateInfo?.RMB_SELL, currency)
    }
  });

  //
  const balanceRequest = useBalance({
    onSuccess: (res) => {
      const balanceInfo = res?.data;
      formatBalances.available = thousandTool( balanceInfo?.Avb_Balance, 'USDT')
      formatBalances.actual = thousandTool( balanceInfo?.Real_Balance, 'USDT')
      formatBalances.maximum = thousandTool( balanceInfo?.AgtBalance, 'USDT')
  }});

  return {
    autoModeRequest,
    ratesRequest,
    balanceRequest,
    currency,
    onRatesSuccess,
    formatBalances,
    formatRates,
  };
});
