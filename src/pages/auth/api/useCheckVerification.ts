import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';
import { useStorage } from 'vue3-storage';

type CheckRes = string;

type CheckProps = {
  reg_countrycode: string;
  reg_tel: string;
  OneTimePwd: string;
};

export default ({ ...useProps }: UseProps) => {
  const vueRequest = requestProvider<CheckRes, CheckProps>({
    reqFn: (props) => {
      const vueStorage = useStorage();
      const registerStorage = vueStorage.getStorageSync<{
        countryCode: number;
        phone: string;
      }>('register');
      const reg_countrycode =
        registerStorage?.countryCode ?? props.reg_countrycode;
      const usePhone = registerStorage?.phone ?? props.reg_tel;
      const reg_tel = usePhone?.replace(/^0/, '');

      const request = axiosProvider
        .post('/ChkoneTimePwd.aspx', { ...props, reg_countrycode, reg_tel })
        .then(({ data }) => data);
      return request;
    },
    isManual: true,
    ...useProps,
    onSuccess: (res) => {
      const vueStorage = useStorage();
      const registerStorage = vueStorage.getStorageSync<{
        countryCode: number;
        phone: string;
      }>('register');
      vueStorage.setStorageSync('register', {
        ...registerStorage,
        token: res?.data
      });
      if (useProps.onSuccess) useProps.onSuccess(res);
    },
    noFeedback: true
  });

  return vueRequest;
};
