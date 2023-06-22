import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type CancelRes = {
  Token: string;
};

type CancelProps = {
  Token: string;
};

export const useCancel = () =>
  requestProvider<CancelRes, CancelProps>({
    reqFn: (props) => axiosProvider.post('/Req_CancelOrder.aspx', props),
    isManual: true,
  });
