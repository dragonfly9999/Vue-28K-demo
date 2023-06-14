import { useRateStore } from 'src/stores';
import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

export const useRate = () => {
  const store = useRateStore();
  return requestProvider<RateRes>({
    reqFn: () => axiosProvider.get('/ChkExRate.aspx'),
    isManual: false,
    onSuccess: (res) => res?.data && store.setRate(res?.data),
    config: {
      cacheKey: 'rate',
      pollingInterval: 1000 * 10 * 60,
      pollingWhenHidden: true,
      refreshOnWindowFocus: true,
      refocusTimespan: 1000 * 3 * 60
    }
  });
};
