import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider'

type TwoFaRes = {
  otpkey: string;
  Qr_img: string;
}
export default (useProps: UseProps<TwoFaRes>)  => {
  const vueRequest = requestProvider<TwoFaRes>(() => {
    const request = axiosProvider
      .get('/Req_otpsetup.aspx', { params: { Type: 1 } })
      .then(({ data }) => data);
    return request
  }, {
    ...useProps,
    manual: false,
  }, {
    noTempData: true,
  }
  )

  return vueRequest
}
