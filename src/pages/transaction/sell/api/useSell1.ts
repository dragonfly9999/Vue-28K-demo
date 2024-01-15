import { requestProvider } from 'src/utils/requestProvider';
import { axiosProvider } from 'src/utils/axiosProvider';

type SellRes = {
  order_token: string;
};

type SellProps = {
  AccountName: string;
  AccountNumber: string;
  BankBranch: string;
  BankName: string;
  UsdtAmt: number;
};

export const useSell1 = ({ ...useProps }: UseProps<SellRes>) => {
  const vueRequest = requestProvider<SellRes, SellProps>({
    reqFn: (props) => {
      const request = axiosProvider
        .post('/req_sell1.aspx', props)
        .then(({ data }) => data);
      return request;
    },
    isManual: true,
    ...useProps
  });

  return vueRequest;
};
