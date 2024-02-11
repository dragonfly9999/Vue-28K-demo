import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';
type BuyProps = {
  Token: string;
};

type BuyRes = {
  order_token: string;
};


export default ({ ...useProps }: UseProps) => {
  const vueRequest = requestProvider<BuyRes, BuyProps>((props) => {
    const request = axiosProvider.post('/Req_Buy2.aspx', props).then(({ data }) => data)
    return request
  },{
    ...useProps,
    manual: true,
  }, {
    noFeedback: true,
    noTempData: true,
  });

  return vueRequest
}
