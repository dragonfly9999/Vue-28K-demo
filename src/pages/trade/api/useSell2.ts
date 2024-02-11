import { requestProvider } from 'src/utils/requestProvider';
import { axiosProvider } from 'src/utils/axiosProvider';

type SellRes = {
  order_token: string;
};

type SellProps = {
  Token: string;
};

export default ({...useProps}: UseProps) => {
  const vueRequest = requestProvider<SellRes, SellProps>((props) => {
    const request = axiosProvider.post('/Req_Sell2.aspx', props)
      .then(({ data }) => data)

    return request;
  }, {
    ...useProps,
    manual: true,
  }, {
    noFeedback: true,
    noTempData: true,
  });

  return vueRequest
}
