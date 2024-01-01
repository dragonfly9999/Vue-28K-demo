import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type CancelRes = {
  nothing: string;
};
type CancelProps = {
  Token: string;
};

type UseProps = {
  onSuccess: () => void;
};

export const useCancel = (props?: UseProps) =>
  requestProvider<CancelRes, CancelProps>({
    reqFn: (props) =>
      axiosProvider
        .post('/Req_CancelOrder.aspx', props)
        .then(({ data }) => data),
    isManual: true,
    ...props
  });
