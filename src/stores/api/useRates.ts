import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

export interface RateRes {
  RMB_BUY: string;
  RMB_SELL: string;
  TransferHandle: string;
  TransferHandle2: string;
}

export const useRates = ({ ...useProps }: UseProps<RateRes>) => {

  const vueRequest =  requestProvider<RateRes>(() => {
    const request = axiosProvider.get('/ChkExRate.aspx').then(({ data }) => data);
    return request;
  },{
    ...useProps,
    manual: false,
    cacheKey: 'rate',
    pollingInterval: 1000 * 10 * 60,
    pollingWhenHidden: true,
    refreshOnWindowFocus: true,
    refocusTimespan: 1000 * 3 * 60,
  });


  return vueRequest
};
