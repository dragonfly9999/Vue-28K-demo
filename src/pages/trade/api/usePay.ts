import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type PayRes = {
  nothing: number;
};
type PayProps = {
  Token: string;
};

export default ({...useProps}: UseProps) => {
  const vueRequest = requestProvider<PayRes, PayProps>((props) => {
    const request = axiosProvider.post('/Req_SellMatch2.aspx', props)
      .then(({ data }) => data);

    return request;
  }, {
    ...useProps,
    manual: true
  }, {
    noTempData: true
  });

  return vueRequest
}
