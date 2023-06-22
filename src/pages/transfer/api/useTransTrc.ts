import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type TransRes = {
  nothing: string;
};
type TransProps = {
  ToAddress: string;
  UsdtAmt: number;
};

type UseProps = {
  onSuccess: () => void;
};

export const useTransTrc = (props?: UseProps) =>
  requestProvider<TransRes, TransProps>({
    reqFn: (props) => axiosProvider.post('/Req_Transfer2.aspx', props),
    isManual: true,
    ...props,
  });
