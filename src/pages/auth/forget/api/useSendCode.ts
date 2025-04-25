import { devEnv } from 'src/router/routes';
import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

// eslint-disable-next-line @typescript-eslint/ban-types
export type SendCodeRes = {
  token: string;
};

type SendCodeProps = {
  CodeVerify: number;
};

export default (useProps: UseProps<SendCodeRes, SendCodeProps>) => {
  const { ...config } = useProps;
  const vueRequest = requestProvider<SendCodeRes, SendCodeProps>(
    (props) => {
      if (devEnv) {
        const tkDemo = {
          code: 200,
          msg: 'code ok',
          data: {
            token: 'xxxzzzz',
          },
        };
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(tkDemo);
          }, 3000);
        });
      } else {
        const request = axiosProvider
          .post('k28/vfy_code', props)
          .then(({ data }) => data);
        return request;
      }
    },
    { manual: true, ...config },
    { noFeedback: true }
  );
  return vueRequest;
};
