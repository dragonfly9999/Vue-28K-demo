import { requestProvider } from 'src/utils/requestProvider';
import { axiosProvider } from 'src/utils/axiosProvider';

type SellRes = {
  order_token: string;
};

type SellProps = {
  AccountName: string;
  AccountNumber: string;
  BankBranch: string;
  BankName: string;
  UsdtAmt: number;
};

type UseProps = {
  onSuccess: (args?: VirgilRes<SellRes>) => void;
};

export const useSell1 = ({ onSuccess }: UseProps) =>
  requestProvider<SellRes, SellProps>({
    reqFn: (props) => axiosProvider.post('/req_sell1.aspx', props),
    isManual: true,
    onSuccess,
  });
