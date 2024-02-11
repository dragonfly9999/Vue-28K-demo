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

export default ({ ...useProps }: UseProps<SellRes>) => {
  const vueRequest = requestProvider<SellRes, SellProps>((props) => {
    const request = axiosProvider
      .post('/req_sell1.aspx', props)
      .then(({ data }) => data);
    return request;
  },{
    manual: true,
    ...useProps
  }, {
    noFeedback: true,
    noTempData: true,
  });

  return vueRequest;
};
