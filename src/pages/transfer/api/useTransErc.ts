import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type TransRes = unknown;

type TransProps = {
  ToAddress: string;
  UsdtAmt: number;
};


export default ({ ...useProps }: UseProps) => {
  const vueRequest = requestProvider<TransRes, TransProps>((props) => {
    const request = axiosProvider.post('/Req_Transfer1.aspx', props).then(({ data }) => data)
    return request;
  }, {
    ...useProps,
    manual: true,
  });

  return vueRequest
}
