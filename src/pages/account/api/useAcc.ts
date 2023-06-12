import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';
import { AccRes } from './useAccHistory';

export const useAcc = () =>
  requestProvider<Omit<AccRes, 'H_id'>>({
    reqFn: () => axiosProvider.get('/GetAgentAcc.aspx'),
    isManual: false
  });
