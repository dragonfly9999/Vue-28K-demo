import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type SendRes = string;

type SendProps = {
  reg_countrycode: string;
  reg_tel: string;
};

export default (useProps: UseProps) => {
  const { ...config } = useProps;

  const vueRequest = requestProvider<SendRes, SendProps>((props) => {
    const request = axiosProvider
      .post('Req_Fpwd_oneTimePwd.aspx', props)
      .then(({ data }) => data);
    return request;
  },{
    manual: true,
    ...config
  }, {
    noFeedback: true,
  });

  return vueRequest;
};
