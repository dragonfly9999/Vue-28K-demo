import { requestProvider } from 'src/utils/requestProvider';
import { axiosProvider } from 'src/utils/axiosProvider';

export const usePending = () =>
  requestProvider<Array<PendingOrder>>({
    reqFn: () => axiosProvider.get('/GetTxPendings.aspx'),
    isManual: false,
  });
