import { useDetailsStore } from 'src/stores';
import { OrderStatusNum } from 'src/stores/live';
import { axiosProvider } from 'src/utils/axiosProvider';
import { requestProvider } from 'src/utils/requestProvider';
import { ComputedRef } from 'vue';
import { LocationQueryValue } from 'vue-router';

type DetailProps = {
  Token: LocationQueryValue | LocationQueryValue[];
  ready: ComputedRef<boolean>;
};

interface RecordDetail {
  MasterType: number;
  CreateDate: '2023.06.19 19:52:45';
  Date: '2023.06.19 19:52:45';
  Tx_HASH: '8xXYQ96G9AW56TY3WAS4C6YP15CU6NJF7369U9CA2V';
  UsdtAmt: number;
  Order_TypeID: number;
  P1: '123456789123456789';
  P2: '陈英文';
  P3: '建设银行';
  P4: '北京总行';
  P5: '許威利|西藏銀行|0000000000000016|拉薩';
  P6: null;
  D1: 7.2;
  D2: 8863.2;
  D3: 1.2; // 手續費比例
  D4: null;
  D5: null;
  Order_StatusID: number;
  DeltaTime: 5370;
  Currency: 'CNY';
  Adj: 0.0;
}

export default ({ Token, ready }: DetailProps) => {
  const { transaction } = useDetailsStore();
  const vueRequest = requestProvider<RecordDetail>(() => {
  if (typeof Token === 'string' && Token in transaction && transaction[Token].Order_StatusID === OrderStatusNum.Complete
  ) {
    return new Promise((resolve) => resolve({
      code: 200,
      msg: '',
      data: transaction[Token]
    }))
  }

    const request = axiosProvider.post('/GetTxDetail.aspx', { Token }).then(({ data }) => data)
    return request;
  }, {
    ready,
    manual: false,
    onSuccess: (res) => {
      transaction[Token as string] = res.data;
    },
  }, {
    noTempData: true,
  });

  return vueRequest
}

export type { RecordDetail }
