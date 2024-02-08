import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';
import { useStorage } from 'vue3-storage';

type RegisterRes = string;
type RegisterProps = {
  reg_pwd: string;
};

export default ({ ...useProps }: UseProps) => {
  const vueRequest = requestProvider<RegisterRes, RegisterProps>((props) => {
    const vueStorage = useStorage();
    const registerStorage = vueStorage.getStorageSync<{
      phone: string;
      countryCode: number;
      token: string;
    }>('register');
    const request = axiosProvider
      .post('/req_RegClient.aspx', {
        ...props,
        reg_countrycode: registerStorage?.countryCode.toString(),
        reg_tel: registerStorage?.phone.replace(/^0/, ''),
        reg_token: registerStorage?.token
      })
      .then(({ data }) => data);
    return request;
  },{
    manual: true,
    ...useProps
  });

  return vueRequest;
};
