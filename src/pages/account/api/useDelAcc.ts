import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type DelProps = {
  H_id: number;
};


export const useDelAcc = ({...useProps}: UseProps ) =>
  requestProvider<null, DelProps>((props) =>
  axiosProvider
    .post('/Req_AgentAccHistory.aspx', props)
    .then(({ data }) => data),{
    ...useProps,
    manual: true,
  });
