import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type MatchProps = {
  Token: string;
};

export default ({ ...useProps }: UseProps) => {
  const vueRequest = requestProvider<string, MatchProps>((props) => {
    const request = axiosProvider
      .post('/Req_BuyMatch1.aspx', props)
      .then(({ data }) => {
        return data;
      });
    return request;
  },{
    ...useProps,
    manual: true,
  });

  return vueRequest
};
