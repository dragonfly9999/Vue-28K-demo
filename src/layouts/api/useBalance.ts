import { useBalanceStore } from 'src/stores';
import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

export const useBalance = () => {
  const { setBalance } = useBalanceStore();
  return requestProvider<BalanceRes>({
    reqFn: () => axiosProvider('/ChkBalance.aspx'),
    isManual: false,
    onSuccess: (res) => res?.data && setBalance(res?.data),
    config: {
      cacheKey: 'balance',
      pollingInterval: 1000 * 10 * 60,
      pollingWhenHidden: true,
      refreshOnWindowFocus: true,
      refocusTimespan: 1000 * 3 * 60
    }
  });
};
