import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

export default ({ ...useProps }: UseProps<Array<OrderRecord>>) => {
  const vueRequest = requestProvider<Array<OrderRecord>>(() => {
    const request =    axiosProvider.get('/GetTxHistory.aspx').then(({ data }) => data)
    return request;
  }, {
    ...useProps,
    manual: false,
    cacheKey: 'history',
    pollingInterval: 1000 * 10 * 60,
    pollingWhenHidden: true,
    refreshOnWindowFocus: true,
    refocusTimespan: 1000 * 3 * 60
  });

  return vueRequest
}
