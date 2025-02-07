import { axiosProvider } from 'src/utils/axiosProvider';
import { storageHelper } from 'src/utils/foragePkg';
import { requestProvider } from 'src/utils/requestProvider';
import { computed } from 'vue';

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
    ready: computed(() => !!storageHelper('isAgent').getItem()),
  }, {
    noFeedback: true,
    noTempData: true,
  });

  return {...vueRequest}
}
