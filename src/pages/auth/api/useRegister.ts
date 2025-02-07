import { axiosProvider } from 'src/utils/axiosProvider';
import { storageHelper } from 'src/utils/foragePkg';
import { requestProvider } from 'src/utils/requestProvider';

type RegisterRes = string;
type RegisterProps = {
  reg_pwd: string;
};

export default ({ ...useProps }: UseProps) => {
  const vueRequest = requestProvider<RegisterRes, RegisterProps>((props) => {
    const registerStorage = storageHelper<{
      phone: string;
      countryCode: number;
      token: string;
    }>('register').getItem();
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
