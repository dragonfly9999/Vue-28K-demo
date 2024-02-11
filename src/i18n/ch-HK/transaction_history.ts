import { MasterTypeNum } from 'src/utils/NumberTool';

export default {

  title: '交易紀錄',
  返回交易: '返回交易',
  label: {
    finish: '完成',
    inProgress: '進行中',
    fail: '未完成',
    currency_type: '幣種',
    rate: '匯率',
    quantity: '數量',
    amount: '金額',
    time: '時間',
    recent: '最近交易',
    name: '交易方姓名',
    balance: '結餘',
    address: '地址',
    order_time: '訂單建立時間',
    transaction_type: {
      5: '全部',
      [MasterTypeNum.Buy]: '購買',
      [MasterTypeNum.Sell]: '出售',
      [MasterTypeNum.TransIn]: '轉入',
      [MasterTypeNum.TransOut]: '轉出',
      exchange: '快速兌換',
      scene: '現場買入'
    },
    // 交易明細
    history_detail: {
      title: '訂單資訊',
      status: '狀態',
      handling_fee: '手續費',
      account_name: '戶名',
      bank_code: '代碼',
      bank_name: '銀行名稱',
      city: '所在省市',
      account_number: '帳號',
      complete_time: '完成時間',
      order_number: '訂單號',
      contract_number: '合約書編號',
      remark: '備註',
      close: '關閉',
      conversation_record: '交易對話紀錄'
    }
  }
}
