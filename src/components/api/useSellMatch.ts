import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type MatchProps = {
  Token: string;
};

type UseProps = {
  onSuccess: () => void;
};

export const useSellMatch = (props?: UseProps) => {
  return requestProvider<OrderRecord, MatchProps>({
    reqFn: (props) => axiosProvider.post('/Req_SellMatch1.aspx', props),

    isManual: true,
    ...props
  });
};
