import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';
import { useStorage } from 'vue3-storage';

type LoginProps = {
  Login_countrycode: string;
  Login_pwd: string;
  Login_tel: string;
};

type LoginRes = {
  login_session: string;
  isAgent: boolean;
};

const storage = useStorage();

export const useLogin = ({ ...useProps }: UseProps) =>
  requestProvider<LoginRes, LoginProps>((props) => {
    const request = axiosProvider
      .post('/login.aspx', props)
      .then(({ data }) => data);
    return request;
  }, {
    manual: true,
    ...useProps,
    onSuccess: (res) => {
      storage.setStorageSync('isAgent', res?.data.isAgent);
      storage.setStorageSync('login_session', res?.data.login_session);
      if (useProps.onSuccess) useProps.onSuccess(res);
    }
  });
