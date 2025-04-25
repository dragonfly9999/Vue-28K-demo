import { devEnv } from 'src/router/routes';
import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

// eslint-disable-next-line @typescript-eslint/ban-types
type SetPwRes = {};

type SetPwProps = {
  token: string;
  new_password: string;
};

export default (useProps: UseProps) => {
  const { ...config } = useProps;
  const vueRequest = requestProvider<SetPwRes, SetPwProps>(
    (props) => {
      if (devEnv) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              code: 200,
              msg: 'set ok',
              data: {},
            });
          }, 3000);
        });
      } else {
        const request = axiosProvider
          .post('k28/set_new_password', props)
          .then(({ data }) => data);
        return request;
      }
    },
    { manual: true, ...config },
    { noFeedback: true }
  );

  return vueRequest;
};
