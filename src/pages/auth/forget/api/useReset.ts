import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';
import { useStorage } from 'vue3-storage';

type ResetRes = string;

type ResetProps = {
  reg_countrycode: string;
  reg_pwd: string;
  reg_tel: string;
  reg_token: string;
};

export default (useProps: UseProps) => {
  const { ...config } = useProps;
  const vueRequest = requestProvider<ResetRes, ResetProps>((props) => {
    const vueStorage = useStorage();
    const forgetInfoStorage = vueStorage.getStorageSync<{
      phone: string;
      countryCode: number;
    }>('forget_Info');
    const request = axiosProvider
      .post('Req_ForgotPwd.aspx', {
        ...props,
        reg_tel: forgetInfoStorage?.phone.replace(/^0/, '')
      })
      .then(({ data }) => data);
    return request;
  },{
    manual: true,
    ...config
  }, {
    noFeedback: true,
  });

  return vueRequest;
};
