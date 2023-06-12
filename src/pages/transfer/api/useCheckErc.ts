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
export const useCheckErc = (props: UseProps) =>
  requestProvider<CheckRes, CheckProps>({
    reqFn: (props) => axiosProvider.post('/ChkToAddressValid.aspx', props),
    isManual: true,
    ...props
  });
