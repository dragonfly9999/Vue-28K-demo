import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type WalletRes = {
  WalletAddress: string;
  Qr_img: string;
  WalletAddress2: string;
  Qr_img2: string;
};

export const useWallet = () =>
  requestProvider<WalletRes>({
    reqFn: () => axiosProvider.get('/GetWallet.aspx').then(({ data }) => data),
    isManual: false
  });
