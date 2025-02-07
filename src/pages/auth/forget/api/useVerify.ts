import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type VerifyRes = string;

type VerifyProps = {
  reg_countrycode: string;
  reg_tel: string;
  OneTimePwd: string;
};

export default ({ ...useProps }: UseProps<VerifyRes, VerifyProps>) => {
  const vueRequest = requestProvider<VerifyRes, VerifyProps>((props) => {
    const request = axiosProvider
      .post('ChkoneTimePwd.aspx', props)
      .then(({ data }) => data);
    return request;
  },{
    manual: true,
    ...useProps
  }, {
    noFeedback: true,
  });

  return vueRequest;
};
