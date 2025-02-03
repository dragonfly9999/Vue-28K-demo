import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type TwoFaCreateRes = {
  otpKey: string;
  Qr_img: string;
}

export default (useProps: UseProps<TwoFaCreateRes>) => {
  const vueRequest = requestProvider<TwoFaCreateRes>(() => {
    const request = axiosProvider
      .get('/Req_otpsetup.aspx', { params: { Type: 3 } })
      .then(({ data }) => data);
    return request
  },
    {
      ...useProps,
      manual: true,
    },
    {
      noTempData: true,
    }
  )

  return vueRequest
}
