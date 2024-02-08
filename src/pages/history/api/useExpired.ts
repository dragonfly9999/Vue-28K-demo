import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

export const useExpired = () => {
  const vueRequest = requestProvider<Array<ExpiredOrder>>(() => {
    const request = axiosProvider.get('/GetTxExpired.aspx').then(({ data }) => data);
    return request;
  },{
    manual: true,
  }, {
    noFeedback: true
  });

  return vueRequest
}
