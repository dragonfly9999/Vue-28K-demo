import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type TransRes = unknown;
type TransProps = {
  ToAddress: string;
  UsdtAmt: number;
  OTP?: number;
  ClientRemark?: string
};

export default ({ ...useProps }: UseProps<TransRes, TransProps>) => {
  const vueRequest = requestProvider<TransRes, TransProps>((props) => {
    const request = axiosProvider.post('/Req_Transfer2.aspx', props).then(({ data }) => data)

    return request;
  },{
    ...useProps,
    manual: true,
  });

  return vueRequest;
}
