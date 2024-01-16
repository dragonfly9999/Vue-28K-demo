import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

export enum AccNum {
  Name = 'P2',
  Account = 'P1',
  BankID = 'P3',
  Branch = 'P4',
  Channel = 'P5'
}

export enum AccountChannelNum {
  All = -1,
  DEMO = 1,
  channel_88U = 2,
  U88 = 3,
  JP88 = 4,
  K100com = 5,
  U28 = 6,
  V100com = 7,
  Fxcoin = 9,
  K200U = 10,
  K100Net = 11
}

export type AccRes = Record<AccNum, string | number | null> & { H_id: number };

export const useAccHistory = ({ ...useProps }: UseProps<Array<AccRes>>) =>
  requestProvider<Array<AccRes>>({
    reqFn: () => {
      const request = axiosProvider
        .get('/GetAgentAccHistory.aspx')
        .then(({ data }) => data);
      return request;
    },
    isManual: false,
    ...useProps
  });
