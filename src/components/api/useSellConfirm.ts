import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type ConfirmRes = {
  nothing: string;
};

type ConfirmProps = {
  Token: string;
};

export const useSellConfirm = ({...useProps}: UseProps<ConfirmRes>) => {
  const vueRequest = requestProvider<ConfirmRes, ConfirmProps>((props) => {
    const request = axiosProvider.post('Req_BuyMatch2.aspx', props).then(({ data }) => data)

    return request;
  }, {
    ...useProps,
    manual: true,
  }, {
    noFeedback: true,
    noTempData: true,
  });

  return vueRequest;
}
