import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type DetailProps = {
  Token: string;
};

export const useDetail = (props: DetailProps) =>
  requestProvider<RecordDetail>({
    reqFn: () =>
      axiosProvider.post('/GetTxDetail.aspx', props).then(({ data }) => data),
    isManual: false
  });
