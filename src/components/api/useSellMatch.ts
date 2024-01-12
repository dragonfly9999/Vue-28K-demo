import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type MatchProps = {
  Token: string;
};

export const useSellMatch = ({ ...useProps }: UseProps) => {
  return requestProvider<OrderRecord, MatchProps>({
    reqFn: (props) =>
      axiosProvider
        .post('/Req_SellMatch1.aspx', props)
        .then(({ data }) => data),

    isManual: true,
    ...useProps
  });
};
