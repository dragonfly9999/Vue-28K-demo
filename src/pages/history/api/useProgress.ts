import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

export const useProgress = () =>
  requestProvider<Array<OrderRecord>>( () =>
    axiosProvider.get('/GetTxPendings.aspx').then(({ data }) => data)
    , {
      manual: true
    }, {
    noFeedback: true
  }
);
