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

export const useTransErc = (props?: UseProps) =>
  requestProvider<TransRes, TransProps>({
    reqFn: (props) => axiosProvider.post('/Req_Transfer1.aspx', props),
    isManual: true,
    ...props
  });
