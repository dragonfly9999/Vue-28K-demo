import { useRateStore } from 'src/stores';
import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

export const useRate = () => {
  const store = useRateStore();
  return requestProvider<RateRes>({
    reqFn: () => axiosProvider.get('/ChkExRate.aspx'),
    isManual: false,
    onSuccess: (res) => res?.data && store.setRate(res?.data)
  });
};
