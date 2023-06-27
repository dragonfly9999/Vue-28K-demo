import { requestProvider } from 'src/utils/requestProvider';
import { axiosProvider } from 'src/utils/axiosProvider';

export const usePending = () => {
  return requestProvider<Array<PendingOrder>>({
    reqFn: () => axiosProvider.get('/GetTxPendings.aspx'),
    isManual: false,
    config: {
      refreshOnWindowFocus: true,
      pollingInterval: 1000 * 60 * 2,
      staleTime: 0,
    },
  });
};
