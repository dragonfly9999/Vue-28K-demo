import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';

type DetailProps = {
  Token: string;
};

export default (props: DetailProps) =>{
  const vueRequest = requestProvider<RecordDetail>(() => {
    const request  =    axiosProvider.post('/GetTxDetail.aspx', props).then(({ data }) => data)
    return request;
  },{
    manual: false
  }, {
    noTempData: true,
  });

  return vueRequest
}
