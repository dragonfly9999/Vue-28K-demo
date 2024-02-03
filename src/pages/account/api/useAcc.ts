import { useAccountStore } from 'src/stores';
import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';
import { ref } from 'vue';
import { AccNum, AccRes } from './useAccHistory';

export const useAcc = () => {
  const accountStore = useAccountStore();
  // state
  const tempAcc = ref<Omit<AccRes, 'H_id'>>({
    [AccNum.Name]: '',
    [AccNum.Account]: '',
    [AccNum.BankID]: '',
    [AccNum.Branch]: '',
    [AccNum.Channel]: -1
  });

  // request
  const vueRequest = requestProvider<
    Omit<AccRes, 'H_id'> & { ChannelSet: string }
  >({
    reqFn: () =>
      axiosProvider.get('/GetAgentAcc.aspx').then(({ data }) => data),
    isManual: false,
    onSuccess: (res) => {
      if (!res) return;
      tempAcc.value = res?.data;
      accountStore.allowChannels = res.data.ChannelSet.split(',').map((value) =>
        Number(value)
      );
    }
  });

  return { ...vueRequest, tempAcc };
};
