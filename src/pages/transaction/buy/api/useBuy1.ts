import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';
type BuyProps = {
  ClientName: string;
  UsdtAmt: string;
};

type BuyRes = {
  order_token: 'F7mgv2sAD27_oolSskDM7A2';
};

type UseProps = {
  onSuccess: (arg: VirgilRes<BuyRes> | undefined) => void;
};
export const useBuy1 = ({ onSuccess }: UseProps) =>
  requestProvider<BuyRes, BuyProps>({
    reqFn: (props) => axiosProvider.post('/Req_Buy1.aspx', props),
    isManual: true,
    onSuccess,
  });
