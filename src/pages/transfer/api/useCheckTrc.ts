import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type CheckRes = unknown;

type CheckProps = {
  ToAddress: string;
};


export default ({ noCheck, ...useProps }: UseProps<CheckRes, CheckProps> & {noCheck: boolean}) => {
  const vueRequest = requestProvider<CheckRes, CheckProps>((props) => {
    if (noCheck) {
      return new Promise((resolve) => {
        resolve({ data: {}, msg: '', code: 1 });
      });
    }
    const request = axiosProvider
      .post('/ChkToAddressValid2.aspx', props)
      .then(({ data }) => data)

    return request;
  },{
    ...useProps,
    manual: true,
  }, {
    noFeedback: true,
    noTempData: true,
  });

  return vueRequest
}

