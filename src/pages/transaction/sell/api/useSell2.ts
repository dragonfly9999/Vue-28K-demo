import { requestProvider } from 'src/utils/requestProvider';
import { axiosProvider } from 'src/utils/axiosProvider';

type SellRes = {
  order_token: string;
};

type SellProps = {
  Token: string;
};

export const useSell2 = () =>
  requestProvider<SellRes, SellProps>((props) =>
    axiosProvider.post('/Req_Sell2.aspx', props).then(({ data }) => data),{
    manual: true
  });
