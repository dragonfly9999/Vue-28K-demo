import { useQuasar } from 'quasar';
import hooks from 'src/hooks';
import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';
import { useStorage } from 'vue3-storage';

type LogoutRes = unknown;

type LogoutProps = unknown;

export default ({ ...useProps }: UseProps<LogoutRes, LogoutProps>) => {
  const q = useQuasar();

  const vueRequest = requestProvider((props) => {
    if (useStorage().getStorageSync('isAgent')) {
      const closeAuto = axiosProvider.post('/Req_AutoPick.aspx', {
        mode: 0
      }).then(() => {
        const request = axiosProvider.get('/logout.aspx', { params: props }).then(({ data }) => data);
        return request
      });

      return closeAuto;
    }
    const request = axiosProvider.get('/logout.aspx', { params: props }).then(({ data }) => data);
    return request
  }, {
    ...useProps,
    manual: true,
    onBefore: () => {
      q.loading.show();
    },
    onSuccess: (res) => {
      Object.values( hooks.useKickOut).forEach(kickStep => kickStep());
      if (useProps.onSuccess) useProps.onSuccess(res);
    },
    onAfter: (res) => {
      q.loading.hide();
      if (useProps.onAfter) useProps.onAfter(res);
    }
  }, {
    noTempData: true,
    noFeedback: true,
  });

  return vueRequest
}
