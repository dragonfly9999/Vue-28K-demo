import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type CheckRes = unknown;

type CheckProps = {
  ToAddress: string;
};

export default ({...useProps}: UseProps<CheckRes,CheckProps>) =>
  requestProvider<CheckRes, CheckProps>((props) => {
    const request = axiosProvider
    .post('/ChkToAddressValid.aspx', props)
    .then(({ data }) => data)

    return request;
  },{
    ...useProps,
    manual: true,
  }, {
    noFeedback: true,
    noTempData: true,
  });
