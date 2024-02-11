import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';
export type BuyProps = {
  ClientName: string;
  UsdtAmt: number;
};

type BuyRes = {
  order_token: string;
};

export default ({
  isTest,
  ...useProps
}: UseProps<BuyRes> & { isTest: boolean }) => {

  const vueRequest = requestProvider<BuyRes, BuyProps>((props: BuyProps) => {
    const UsdtAmt = import.meta.env.DEV && isTest ? 30 : props.UsdtAmt;
    const request = axiosProvider
      .post('/Req_Buy1.aspx', {
        ...props,
        UsdtAmt
      })
      .then(({ data }) => data);

    return request;
  },{
    ...useProps,
    manual: true,
  }, {
    noFeedback: true,
    noTempData: true,
  });

  return vueRequest;
};
