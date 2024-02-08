import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type ConfirmRes = {
  nothing: string;
};

type ConfirmProps = {
  Token: string;
};

export const useSellConfirm = () =>
  requestProvider<ConfirmRes, ConfirmProps>((props) =>
    axiosProvider.post('Req_BuyMatch2.aspx', props).then(({ data }) => data),{
    manual: true,
  });
