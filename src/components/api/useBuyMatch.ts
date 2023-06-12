import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type MatchProps = {
  Token: string;
};

type UseProps = {
  onTriger: () => void;
};

export const useBuyMatch = ({ onTriger }: UseProps) => {
  return requestProvider<string, MatchProps>({
    reqFn: (props) =>
      axiosProvider.post('/Req_BuyMatch1.aspx', props).then(({ data }) => {
        onTriger();
        return data;
      }),
    isManual: true
  });
};
