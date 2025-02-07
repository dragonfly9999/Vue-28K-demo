import { axiosProvider } from 'src/utils/axiosProvider';
import { storageHelper } from 'src/utils/foragePkg';
import { requestProvider } from 'src/utils/requestProvider';

type CheckRes = string;

type CheckProps = {
  reg_countrycode: string;
  reg_tel: string;
  OneTimePwd: string;
};

export default ({ ...useProps }: UseProps) => {
  const vueRequest = requestProvider<CheckRes, CheckProps>((props) => {
    const registerStorage = storageHelper<{
      countryCode: number;
      phone: string;
    }>('register').getItem();
    const reg_countrycode =
      registerStorage?.countryCode ?? props.reg_countrycode;
    const usePhone = registerStorage?.phone ?? props.reg_tel;
    const reg_tel = usePhone?.replace(/^0/, '');

    const request = axiosProvider
      .post('/ChkoneTimePwd.aspx', { ...props, reg_countrycode, reg_tel })
      .then(({ data }) => data);
    return request;
  },{
    manual: true,
    ...useProps,
    onSuccess: (res) => {
      if (res) {
        const registerStorage = storageHelper<{
          countryCode: number;
          phone: string;
        }>('register').getItem();
        storageHelper<{
          countryCode?: number;
          phone?: string;
          token: string
        }>('register').setItem( {
          ...(registerStorage ||{}),
          token: res.data
        });
      }

      if (useProps.onSuccess) useProps.onSuccess(res);
    },
  }, {
    noFeedback: true,
  });

  return vueRequest;
};
