import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

export const useBalance = () => {
  return requestProvider<BalanceRes>({
    reqFn: () => axiosProvider.get('/ChkBalance.aspx'),
    isManual: false,
    config: {
      cacheKey: 'balance',
      pollingInterval: 1000 * 10 * 60,
      pollingWhenHidden: true,
      refreshOnWindowFocus: true,
      refocusTimespan: 1000 * 3 * 60,
    },
  });
};
