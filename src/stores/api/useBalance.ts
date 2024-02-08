import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

export interface BalanceRes {
  Real_Balance: number;
  Avb_Balance: number;
  AgtBalance: number;
  Lvl: number;
}

export const useBalance = ({...useProps}: UseProps<BalanceRes>) => {
  const vueRequest = requestProvider<BalanceRes>(() => {
    const request = axiosProvider.get('/ChkBalance.aspx').then(({ data }) => data);
    return request
  }, {
    ...useProps,
    manual: false,
    cacheKey: 'balance',
    pollingInterval: 1000 * 10 * 60,
    pollingWhenHidden: true,
    refreshOnWindowFocus: true,
    refocusTimespan: 1000 * 3 * 60
  }, {
    noFeedback: true,
  }
  );
  return vueRequest
};
