import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

export const useHistory = () =>
  requestProvider<Array<OrderRecord>>({
    reqFn: () => axiosProvider.get('/GetTxHistory.aspx'),
    isManual: true,
    noFeedback: true,
    config: {
      cacheKey: 'history'
    }
  });
