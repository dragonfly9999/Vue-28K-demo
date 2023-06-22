import { requestProvider } from 'src/utils/requestProvider';
import { axiosProvider } from 'src/utils/axiosProvider';

type SellRes = {
  order_token: string;
};

type SellProps = {
  Token: string;
};

export const useSell2 = () =>
  requestProvider<SellRes, SellProps>({
    reqFn: (props) => axiosProvider.post('/Req_Sell2.aspx', props),
    isManual: true,
  });
