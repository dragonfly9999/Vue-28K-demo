import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';
import { AccRes } from './useAccHistory';


export const useSetAcc = ({...useProps}: UseProps) =>
  requestProvider<null, Omit<AccRes, 'H_id'>>((props) => {
    const request = axiosProvider
      .post('/SetAgentAcc.aspx', props)
      .then(({ data }) => data);
    return request;
  },{
    ...useProps,
    manual: true,
  });
