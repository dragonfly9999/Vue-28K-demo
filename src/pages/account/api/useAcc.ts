import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';
import { ref } from 'vue';
import { AccNum, AccRes } from './useAccHistory';

export const useAcc = () => {
  const tempAcc = ref<Omit<AccRes, 'H_id'>>({
    [AccNum.Name]: '',
    [AccNum.Account]: '',
    [AccNum.BankID]: '',
    [AccNum.Branch]: ''
  });
  const request = requestProvider<Omit<AccRes, 'H_id'>>({
    reqFn: () =>
      axiosProvider.get('/GetAgentAcc.aspx').then(({ data }) => data),
    isManual: false,
    onSuccess: (res) => {
      if (res) tempAcc.value = res?.data;
    }
  });

  return { request, tempAcc };
};
