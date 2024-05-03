import { MasterTypeNum } from 'src/utils/NumberTool';

export default {

  title: '交易紀錄',
  返回交易: '返回交易',
  進行中: '進行中',
  完成: '完成',
  未完成: '未完成',
  數量: '數量',
  時間: '時間',
  訂單建立時間: '訂單建立時間',
  order_number: '訂單號',
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
  戶名: '戶名',

}
