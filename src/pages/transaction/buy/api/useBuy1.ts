import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';
export type BuyProps = {
  ClientName: string;
  UsdtAmt: number;
};

type BuyRes = {
  order_token: 'F7mgv2sAD27_oolSskDM7A2';
};

type UseProps = {
  onSuccess: (arg: VirgilRes<BuyRes> | undefined) => void;
};
export const useBuy1 = ({ onSuccess }: UseProps) =>
  requestProvider<BuyRes, BuyProps>({
    reqFn: (props: BuyProps) =>
      axiosProvider.post('/Req_Buy1.aspx', {
        ...props,
        UsdtAmt: import.meta.env.DEV ? 30 : props.UsdtAmt,
      }),
    isManual: true,
    onSuccess,
  });
