import { MasterTypeNum } from 'src/utils/NumberTool';

export default {
  title: 'Transaction Records',
  返回交易: 'Back to Transactions',
  進行中: 'In Progress',
  完成: 'Completed',
  未完成: 'Not Completed',
  數量: 'Quantity',
  時間: 'Time',
  訂單建立時間: 'Order Creation Time',
  transaction_type: {
    5: 'All',
    [MasterTypeNum.Buy]: 'Buy',
    [MasterTypeNum.Sell]: 'Sell',
    [MasterTypeNum.TransIn]: 'Transfer In',
    [MasterTypeNum.TransOut]: 'Transfer Out',
    exchange: 'Quick Exchange',
    scene: 'Spot Purchase'
  },
  // 交易明細
  戶名: 'Account Name',
}

