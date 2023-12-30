import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

export const useProgress = () =>
  requestProvider<Array<OrderRecord>>({
    reqFn: () => axiosProvider.get('/GetTxPendings.aspx'),
    isManual: true,
    noFeedback: true
  });
