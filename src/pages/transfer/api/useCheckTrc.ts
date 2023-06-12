import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type CheckRes = {
  nothing: string;
};
type CheckProps = {
  ToAddress: string;
};

type UseProps = {
  onSuccess: () => void;
  onError: () => void;
};

export const useCheckTrc = (props: UseProps) =>
  requestProvider<CheckRes, CheckProps>({
    reqFn: (props) => axiosProvider.post('/ChkToAddressValid2.aspx', props),
    isManual: true,
    ...props
  });
