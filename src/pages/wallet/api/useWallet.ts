import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type WalletRes = {
  WalletAddress: string;
  Qr_img: string;
  WalletAddress2: string;
  Qr_img2: string;
};

export default ({...useProps}: UseProps<WalletRes>) => {
  const vueRequest = requestProvider<WalletRes>(() => {
    const request = axiosProvider.get('/GetWallet.aspx').then(({ data }) => data);
    return request
  }, {
    ...useProps,
    manual: false,
  }, {
    noTempData: true,
  });

  return vueRequest;
}
