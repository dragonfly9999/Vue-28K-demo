import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';
import { ComputedRef } from 'vue';

type AutoProps = number;

type AutoMode = {
  AutoMode: number;
};

export const useAuto = (ready: ComputedRef<boolean>) =>
  requestProvider<AutoMode, AutoProps>({
    reqFn: (mode) => {
      const request = axiosProvider
        .post('/Req_AutoPick.aspx', {
          mode: mode === undefined ? -1 : mode
        })
        .then(({ data }) => data);
      return request;
    },
    isManual: false,
    config: {
      pollingInterval: -1,
      refreshOnWindowFocus: false,
      ready
    }
  });
