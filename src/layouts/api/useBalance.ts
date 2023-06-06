import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';


export const useBalance = () => {
  return requestProvider<BalanceRes>({
    reqFn: () => axiosProvider('/ChkBalance.aspx'),
    isManual: false
  });
};
