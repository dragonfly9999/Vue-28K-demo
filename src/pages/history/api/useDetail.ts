import { RecordDetail } from 'src/pages/trade/api';
import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type DetailProps = {
  Token: string;
};

export const useDetail = (props: DetailProps) =>
  requestProvider<RecordDetail>(() =>
    axiosProvider.post('/GetTxDetail.aspx', props).then(({ data }) => data),{
    manual: false
  });
