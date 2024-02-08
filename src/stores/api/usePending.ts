import { requestProvider } from 'src/utils/requestProvider';
import { axiosProvider } from 'src/utils/axiosProvider';
import { computed } from 'vue';
import { useStorage } from 'vue3-storage';

export default ({...useProps}: UseProps<Array<PendingOrder>>)=> {
  const vueRequest =  requestProvider<Array<PendingOrder>>(() =>{
    const request = axiosProvider.get('/GetTxPendings.aspx').then(({ data }) => data)
    return request
  }, {
    ...useProps,
    ready: computed(() => !useStorage().getStorageSync('isAgent')),
    manual: false,
    refreshOnWindowFocus: true,
    pollingInterval: 1000 * 60 * 2,
    staleTime: 0,
  });

  return vueRequest
};
