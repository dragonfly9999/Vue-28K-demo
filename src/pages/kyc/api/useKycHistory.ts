import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';
import { ref } from 'vue';

type BankSetRes = {
  P1: string;
  P2: string;
  P3: string;
  P4: string;
  P5: string;
  User_BankStatus: number;
  token: string;
};

type FormatKycOptions = BankSetRes;

export default ({ ...useProps }: UseProps<Array<BankSetRes>>) => {
  const tempKycs = ref<Array<FormatKycOptions>>([]);
  const vueRequest = requestProvider<Array<BankSetRes>>(() => {
    const request = axiosProvider
      .get('/Get_UserBankSet.aspx')
      .then(({ data }) => {
        tempKycs.value = data;
        return data;
      });
    return request;
  },{
    ...useProps,
    manual: false,
  });
  return { vueRequest, tempKycs };
};

export type { FormatKycOptions };
