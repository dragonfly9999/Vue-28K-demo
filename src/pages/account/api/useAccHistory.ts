import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

export enum AccNum {
  Account = 'P1',
  Name = 'P2',
  BankID = 'P3',
  Branch = 'P4'
}

export type AccRes = Record<AccNum, string> & { H_id: number };

export const useAccHistory = () =>
  requestProvider<Array<AccRes>>({
    reqFn: () => axiosProvider.get('/GetAgentAccHistory.aspx'),
    isManual: false
  });
