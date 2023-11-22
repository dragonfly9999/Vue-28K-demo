import { axiosProvider } from 'src/utils/axiosProvider';
import { useRequest } from 'vue-request';

type CreateProps = {
  SType: 1;
  P1: string;
  P2: string;
  P3: string;
  P4: string;
  P5: 'CNY';
  Img1: string;
  Img2: string; // 用來包裝資料
};
type CreateRes = 'success';

export default ({ ...useProps }: UseProps<CreateRes>) => {
  const vueRequest = useRequest<VirgilRes<CreateRes>, [CreateProps]>(
    (props) => {
      const request = axiosProvider
        .post('/Req_UserBankSet.aspx', props)
        .then(({ data }) => data);
      return request;
    },
    {
      manual: true,
      ...useProps
    }
  );
  return vueRequest;
};
