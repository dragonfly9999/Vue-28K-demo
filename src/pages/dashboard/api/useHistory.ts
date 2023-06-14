import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

export const useHisotry = () =>
  requestProvider<Array<OrderRecord>>({
    reqFn: () => axiosProvider.get('/GetTxHistory.aspx'),
    isManual: false,
    config: {
      cacheKey: 'history',
      pollingInterval: 1000 * 10 * 60,
      pollingWhenHidden: true,
      refreshOnWindowFocus: true,
      refocusTimespan: 1000 * 3 * 60
    }
  });
