import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type SendRes = string;

type SendProps = {
  reg_countrycode: string;
  reg_tel: string;
};

export default ({ ...useProps }: UseProps) => {
  const vueRequest = requestProvider<SendRes, SendProps>({
    reqFn: (props) => {
      const request = axiosProvider
        .post('/Req_oneTimePwd.aspx', props)
        .then(({ data }) => data);
      return request;
    },
    isManual: true,
    ...useProps
  });

  return vueRequest;
};
