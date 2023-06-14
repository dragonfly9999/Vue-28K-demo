import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

export const useExpired = () =>
  requestProvider<Array<ExpiredOrder>>({
    reqFn: () => axiosProvider.get('/GetTxExpired.aspx'),
    isManual: false,
  });
