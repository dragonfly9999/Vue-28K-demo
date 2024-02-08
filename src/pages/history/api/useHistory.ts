import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type OrderHistoryProps = {
  BeginDate: string;
  EndDate: string;
}

export const useHistory = () => {
  const vueRequest =
    requestProvider<Array<OrderRecord>, OrderHistoryProps>((props) => {
      const request = axiosProvider.get('/GetTxHistory.aspx', { params: props })
        .then(({ data }) => data);
      return request
    },{
      manual: true,
      cacheKey: 'history'
    }, {
      noFeedback: true,
    });
  return {...vueRequest}
}
