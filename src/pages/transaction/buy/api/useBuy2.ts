import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';
type BuyProps = {
  Token: string;
};

type BuyRes = {
  order_token: 'F7mgv2sAD27_oolSskDM7A2';
};

type UseProps = {
  onSuccess: (arg: VirgilRes<BuyRes> | undefined) => void;
};
export const useBuy2 = (props?: UseProps) =>
  requestProvider<BuyRes, BuyProps>({
    reqFn: (props) => axiosProvider.post('/Req_Buy2.aspx', props),
    isManual: true,
    ...props,
  });
