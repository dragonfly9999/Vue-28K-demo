import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type AppleaRes = {
  nothing: string;
};

type AppleaProps = {
  Token: string;
};

export const useAppeal = () =>
  requestProvider<AppleaRes, AppleaProps>({
    reqFn: (props) =>
      axiosProvider.post('/Req_Appeal.aspx', props).then(({ data }) => data),
    isManual: true
  });
