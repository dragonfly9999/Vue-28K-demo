import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type BankSetRes = {
  P1: string;
  P2: string;
  P3: string;
  P4: string;
  P5: string;
  User_BankStatus: number;
  token: string;
};

type FormatKycOptions = BankSetRes;

export default ({ ...useProps }: UseProps<Array<BankSetRes>>) => {
  const vueRequest = requestProvider<Array<BankSetRes>>(() => {
    const request = axiosProvider
      .get('/Get_UserBankSet.aspx')
      .then(({ data }) => {
        return data;
      });
    return request;
  },{
    ...useProps,
    manual: false,
  });
  return vueRequest
};

export type { FormatKycOptions };
