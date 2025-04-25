import { devEnv } from 'src/router/routes';
import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type VfyMailRes = {
  demoOTP: number;
};

type VfyMailProps = {
  Email: string;
};

export default (useProps: UseProps) => {
  const { ...config } = useProps;
  const vueRequest = requestProvider<VfyMailRes, VfyMailProps>(
    (props) => {
      if (devEnv) {
        if (props.Email === 'failMail@gmail.com') {
          return new Promise((_, reject) => {
            setTimeout(() => {
              reject({
                response: {
                  data: {
                    code: 409,
                    msg: 'Not been vfy Mail',
                    data: null,
                  },
                },
              });
            }, 3000);
          });
        }
        const demoOtp = {
          code: 200,
          msg: 'demo Otp',
          data: {
            demoOTP: 999999,
          },
        };

        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(demoOtp);
          }, 3000);
        });
      } else {
        const request = axiosProvider
          .post('k28/vfy_email', props)
          .then(({ data }) => data);
        return request;
      }
    },
    { manual: true, ...config },
    {
      noFeedback: true,
    }
  );
  return vueRequest;
};
