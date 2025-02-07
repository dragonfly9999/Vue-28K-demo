import { axiosProvider } from 'src/utils/axiosProvider';
import { storageHelper } from 'src/utils/foragePkg';
import { requestProvider } from 'src/utils/requestProvider';

type LoginProps = {
  Login_countrycode: string;
  Login_pwd: string;
  Login_tel: string;
};

type LoginRes = {
  login_session: string;
  isAgent: boolean;
};


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
      storageHelper<boolean>('isAgent').setItem(res?.data.isAgent)
      storageHelper('login_session').setItem(res?.data.login_session)
      if (useProps.onSuccess) useProps.onSuccess(res);
    }
  }, {
    noFeedback: true,
    noTempData: true,
  }
);
