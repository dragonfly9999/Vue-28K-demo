import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type MatchProps = {
  Token: string;
};

export const useBuyMatch = ({ ...useProps }: UseProps) => {
  return requestProvider<string, MatchProps>({
    reqFn: (props) => {
      const request = axiosProvider
        .post('/Req_BuyMatch1.aspx', props)
        .then(({ data }) => {
          return data;
        });
      return request;
    },
    isManual: true,
    ...useProps
  });
};
