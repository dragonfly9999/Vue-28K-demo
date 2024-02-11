import { useQuasar } from 'quasar';
import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type CancelRes = {
  nothing: string;
};
type CancelProps = {
  Token: string;
};


export const useCancel = ({ ...useProps }: UseProps) => {
  const q = useQuasar();
  const vueRequest = requestProvider<CancelRes, CancelProps>((props) => {
    const request = axiosProvider
      .post('/Req_CancelOrder.aspx', props)
      .then(({ data }) => data);

    return request
  },{
    ...useProps,
    manual: true,
    onBefore: () => {
      q.loading.show();
    },
    onAfter: (params) => {
      q.loading.hide();
      if (useProps.onAfter) useProps.onAfter(params);
    }
  }, {
    noFeedback: true,
    noTempData: true,
  });

  return vueRequest
}
