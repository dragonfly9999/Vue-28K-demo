import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type DelProps = {
  H_id: number;
};

type UseProps = {
  onSuccess?: () => void;
  noFeedback?: boolean;
};

export const useDelAcc = (props: UseProps) =>
  requestProvider<null, DelProps>({
    reqFn: (props) =>
      axiosProvider
        .post('/Req_AgentAccHistory.aspx', props)
        .then(({ data }) => data),
    isManual: true,
    ...props
  });
