import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';
import { AccRes } from './useAccHistory';

type UseProps = {
  onSuccess: () => void;
};

export const useSetAcc = (props: UseProps) =>
  requestProvider<null, Omit<AccRes, 'H_id'>>({
    reqFn: (props) => {
      const request = axiosProvider
        .post('/SetAgentAcc.aspx', props)
        .then(({ data }) => data);
      return request;
    },
    isManual: true,
    ...props
  });
