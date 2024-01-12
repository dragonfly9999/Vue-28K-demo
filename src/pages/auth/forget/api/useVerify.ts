import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type VerifyRes = string;

type VerifyProps = {
  reg_countrycode: string;
  reg_tel: string;
  OneTimePwd: string;
};

export default ({ ...useProps }: UseProps) => {
  const vueRequest = requestProvider<VerifyRes, VerifyProps>({
    reqFn: (props) => {
      const request = axiosProvider
        .post('ChkoneTimePwd.aspx', props)
        .then(({ data }) => data);
      return request;
    },
    isManual: true,
    noFeedback: true,
    ...useProps
  });

  return vueRequest;
};
