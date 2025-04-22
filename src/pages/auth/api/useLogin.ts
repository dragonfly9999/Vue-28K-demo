import { messages } from 'src/i18n';
import { axiosProvider } from 'src/utils/axiosProvider';
import { storageHelper } from 'src/utils/foragePkg';
import { requestProvider } from 'src/utils/requestProvider';

const isDev = import.meta.env.DEV;

type LoginProps = {
  Email: string;
  Pwd: string;
};

type LoginRes = {
  login_session: string;
  isAgent: boolean;
};

export const useLogin = ({ ...useProps }: UseProps) =>
  requestProvider<LoginRes, LoginProps>(
    (props) => {
      if (isDev) {
        const devResTest = {
          code: 200,
          msg: 'Login Session successfully',
          data: {
            login_session: 'abdsdadasewqewqkfd',
            isAgent: true,
          },
        };
        const isA = devResTest.data.isAgent;
        storageHelper<boolean>('isAgent').setItem(isA);
        storageHelper('login_session').setItem(devResTest.data.login_session);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(devResTest);
          }, 3000);
        });
      } else {
        const request = axiosProvider
          .post('k28/login.askk', props)
          .then(({ data }) => data);
        return request;
      }
    },
    {
      manual: true,
      ...useProps,
      onSuccess: (res) => {
        const isA = res?.data.isAgent;
        storageHelper<boolean>('isAgent').setItem(isA);
        storageHelper('login_session').setItem(res?.data.login_session);
        if (useProps.onSuccess) useProps.onSuccess(res);
      },
    },
    {
      noFeedback: true,
      noTempData: true,
    }
  );
