import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type AutoProps = number;

type AutoMode = {
  AutoMode: number;
};

export const useAuto = () =>
  requestProvider<AutoMode, AutoProps>({
    reqFn: (mode) =>
      axiosProvider.post('/Req_AutoPick.aspx', {
        mode: mode === undefined ? -1 : mode
      }),
    isManual: false,
    config: {
      pollingInterval: -1,
      refreshOnWindowFocus: false
    }
  });
