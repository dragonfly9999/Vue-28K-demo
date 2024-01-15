import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';
export type BuyProps = {
  ClientName: string;
  UsdtAmt: number;
};

type BuyRes = {
  order_token: 'F7mgv2sAD27_oolSskDM7A2';
};

export const useBuy1 = ({
  isTest,
  ...useProps
}: UseProps<BuyRes> & { isTest: boolean }) => {
  const vueRequest = requestProvider<BuyRes, BuyProps>({
    reqFn: (props: BuyProps) => {
      const UsdtAmt = import.meta.env.DEV && isTest ? 30 : props.UsdtAmt;
      const request = axiosProvider
        .post('/Req_Buy1.aspx', {
          ...props,
          UsdtAmt
        })
        .then(({ data }) => data);
      return request;
    },
    isManual: true,
    ...useProps
  });
  return vueRequest;
};
