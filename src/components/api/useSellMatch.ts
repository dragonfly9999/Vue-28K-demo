import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type MatchProps = {
  Token: string;
};

export default ({ ...useProps }: UseProps<OrderRecord, MatchProps>) => {
  const vueRequest =  requestProvider<OrderRecord, MatchProps>((props) => {
    const request = axiosProvider
      .post('/Req_SellMatch1.aspx', props)
      .then(({ data }) => data);
    return request;
  }, {
    ...useProps,
    manual: true,
  });

  return vueRequest
};
