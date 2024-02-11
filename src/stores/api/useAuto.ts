import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';
import { computed } from 'vue';
import { useStorage } from 'vue3-storage';

type AutoProps = number ;

type AutoMode = {
  AutoMode: number;
};

export const useAuto = ({ ...useProps }: UseProps) => {
  const vueRequest = requestProvider<AutoMode, AutoProps>((mode) => {
    const request = axiosProvider
      .post('/Req_AutoPick.aspx', {
        mode: mode === undefined ? -1 : mode
      })
      .then(({ data }) => data);
    return request;
  }, {
    ...useProps,
    manual: false,
    pollingInterval: -1,
    refreshOnWindowFocus: false,
    ready: computed(() => !!useStorage().getStorageSync('isAgent')),
  }, {
    noFeedback: true,
    noTempData: true,
  });

  return {...vueRequest}
}
