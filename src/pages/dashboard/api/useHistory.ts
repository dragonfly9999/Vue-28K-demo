import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

export const useHisotry = () =>
  requestProvider<Array<OrderRecord>>({
    reqFn: () => axiosProvider.get('/GetTxHistory.aspx'),
    isManual: false
  });
