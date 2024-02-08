import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type CheckRes = string;

type CheckProps = {
  reg_countrycode: string;
  reg_tel: string;
};

export default ({ ...useProps }: UseProps) => {
  const vueRequest = requestProvider<CheckRes, CheckProps>((props) => {
    const request = axiosProvider
      .post('/ChkLoginExists.aspx', props)
      .then(({ data }) => data);
    return request;
  },{
    manual: true,
    ...useProps
  }, {
    noTempData: true,
  });

  return vueRequest;
};
