import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type PayRes = {
  nothing: number;
};
type PayProps = {
  Token: string;
};

export const usePay = () =>
  requestProvider<PayRes, PayProps>((props) =>
    axiosProvider.post('/Req_SellMatch2.aspx', props)
      .then(({ data }) => data)
    , {
    manual: true
  });
