import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

export const useRates = ({ ...useProps }: UseProps<RateRes>) => {
  return requestProvider<RateRes>({
    reqFn: () => axiosProvider.get('/ChkExRate.aspx').then(({ data }) => data),
    isManual: false,
    config: {
      cacheKey: 'rate',
      pollingInterval: 1000 * 10 * 60,
      pollingWhenHidden: true,
      refreshOnWindowFocus: true,
      refocusTimespan: 1000 * 3 * 60
    },
    ...useProps
  });
};
