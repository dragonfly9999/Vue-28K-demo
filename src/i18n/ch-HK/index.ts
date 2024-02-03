import { AccNum } from 'src/pages/account/api';
import { MasterTypeNum } from 'src/utils/NumberTool';
import kyc from './kyc';
import error from './error';
import auth from './auth';
import dashboard from './dashboard';
import transaction from './transaction';
import account from './account';
import main from './main';
import transfer from './transfer';

export default {
  name: '中文',
  訊息: '訊息',
  locale: 'ch-HK',
  交易進行中: '交易進行中',
  交易: '交易',
  購買: '購買',
  出售: '出售',
  連線中: '連線中',
  返回: '返回',
  確認: '確認',
  kyc,
  auth,
  dashboard,
  transaction,
  account,
  main,
  transfer,
  error,
  // 錢包wallet
  wallet: {
    title: '我的錢包',
    label: {
      warning_title: '請確認您所選擇的協議種類',
      warning_text_1: '請確保所選協議種類與接收錢包或交易所的協議種類相符。',
      warning_text_2: '否則您將無法找回已丟失的加密貨幣。',
      address: '錢包地址',
      hint: '您可以使用此錢包地址接收其他人的加密貨幣',
      record: '查看紀錄',
      back_front_page: '返回主頁',
      avb_balance: '可提',
      real_balance: '結餘'
    }
  },
  cancel: {
    title: '即將離開',
    content: '注意！資料將不會儲存'
  },
  countryCode: {
    886: '台灣+886',
    852: '香港+852',
    65: '新加坡+65',
    86: '中國+86',
    84: '越南+84',
    81: '日本+81',
    63: '菲律賓+63'
  },
  success: '成功',
  新增帳戶: '新增帳戶',
  label: {
    welcome: '歡迎登入',
    logout: '登出',
    transfer: '轉帳',
    wallet: '錢包',
    history: '交易紀錄',
    account: '帳戶管理',
    language: '語言',
    inProgress: '進行中',
    real_balance: '結餘',
    avb_balance: '可提',
    notify: '通知',
    beep: '提示',
    auto: '自動接單',
    sell: '出售',
    buy: '購買',
    no_order: '沒有訂單',
    close: '關閉',
    order_number: '訂單號',
    rate: '匯率',
    skip: '略過',
    upload_image: '上傳圖片',
    appeal: '申訴',
    confirm: '確認',
    remark: '備註',
    back: '返回',
    add_account: '新增帳戶',
    del_hint: '是否要刪除帳戶',
    preset_hint: '是否要設為預設帳戶',
    preset_hint2: '設為預設帳戶：以此做為交易時的 收款帳戶',
    CNY: {
      [AccNum.Account]: '銀行帳號',
      [AccNum.Name]: '銀行戶名',
      [AccNum.BankID]: '銀行名稱',
      [AccNum.Branch]: '所在省市',
      account: '人民幣CNY帳戶'
    },
    bank_info: '填寫銀行資料',
    title_add_account: '新增帳戶',
    jump: '等待跳轉',
    TWD: '新台幣TWD帳戶',
    USD: '美金USD帳戶',
    VND: '越南盾VND帳戶',
    undefined: '未定義',
    notify_hint: '即時接收瀏覽器通知',
    beep_hint: '即時訂單提示音',
    auto_hint: '有即時訂單時，系統自動接受配對'
  },
  chatName: {
    1: '會員A',
    2: '客服',
    3: '會員A'
  },

  transaction_history: {
    title: '交易紀錄',
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
  },
  購買USDT: '購買USDT',
  buy: {
    //buy step
    step_hint_buy_title_1: '提交訂單',
    step_hint_buy_text_1: '請填寫訂單資料',
    step_hint_buy_title_2: '請付款',
    step_hint_buy_text_2:
      '請按照轉帳資料進行付款，完成付款後點擊「已完成付款」。',
    step_hint_buy_title_3: '等待確認',
    step_hint_buy_text_3: '等待對方確認收到款項後，即可完成。',
    step_hint_buy_title_4: '交易完成',
    step_hint_buy_text_4: '此筆交易已完成',
    //
    buy_usdt: '購買USDT',
    enter_the_purchase_quantity: '請輸入購買數量',
    i_want_to_buy: '我要購買',
    i_will_pay: '我需支付',
    select_payment_account: '請選擇付款帳戶',
    purchase_quantity: '購買數量',
    transfer_info: '轉帳資料',
    waiting_for_confirmation: '已提交，等待確認中',
    // hint
    hint: '完成轉帳後，可上傳匯款憑證給收款方確認',
    bankInformation: {
      amount: '金額',
      amount_name: '收款方戶名',
      account_number: '收款方帳號',
      bank_name: {
        TWD: '銀行名稱',
        CNY: '銀行名稱',
        VND: '銀行名稱'
      },
      code: {
        TWD: '銀行代碼',
        CNY: '所在省市',
        VND: '銀行名稱'
      }
    }
  },

  sell: {
    //buy step
    step_hint_sell_title_1: '提交訂單',
    step_hint_sell_text_1: '請填寫訂單資料',
    step_hint_sell_title_2: '等待付款',
    step_hint_sell_text_2: '需等待對方付款',
    step_hint_sell_title_3: '確認收款',
    step_hint_sell_text_3: '對方已完成付款，請確認您的收款帳戶是否到帳',
    step_hint_sell_title_4: '交易完成',
    step_hint_sell_text_4: '此筆交易已完成',
    wallet_balance: '錢包餘額',
    enter_the_sale_quantity: '請輸入出售數量',
    i_want_to_sell: '我要出售',
    i_will_receive: '我將收到',
    select_receiving_account: '請選擇收款帳戶',
    sell_quantity: '出售數量',
    hint1: '請等待付款方完成轉帳',
    hint2: '請查看您的收款帳戶是否到帳',
    hint3: '我已經確認收款帳戶已到帳，且金額、交易方姓名都正確',
    payer_account_name: '付款方姓名',
    appeal_hint: '您已提出申訴，稍後客服人員會在「交易對話」與交易雙方進行協調'
  },
  開始配對: '開始配對',
  配對中: '配對中',
  rate: {
    title: '參考匯率: ', // new
    update: '更新時間',
    buy: '購買',
    sell: '出售',
    exchange: '兌換匯率'
  },
  currency: {
    CNY: '人民幣',
    TWD: '新台幣',
    USD: '美金',
    VND: '越南盾'
  },
  warn: {
    hint_not_yet_verified: '請先完成以下帳戶驗證',
    hint_transaction_notes_1: 'ATM轉帳時請註記持有人的',
    hint_transaction_notes_2: '真實姓名',
    hint_transaction_notes_3:
      '，並顯示於雙方明細，資料不符時將不受理交易服務，並退還收款金額，相關手續費會於退款時一倂扣除，謝謝。',
    hint_check_info_1: '我已經按照轉帳資料，自行完成轉帳動作。',
    hint_check_info_2: '完成轉帳後，可上傳交易明細給收款方確認',
    hint_check_info_3: '請您按照轉帳資料，自行完成轉帳動作。',
    hint_cny_1: '為保障交易雙方帳戶安全，請務必仔細閱讀，並配合以下驗證',
    hint_cny_2: '請提供24小時內銀行流水帳截圖',
    hint_cny_3: '交易雙方核實通過後，請於交易對話窗提供完整轉帳、匯款資料',
    hint_cny_4:
      '付款後可以於交易對話窗提供轉帳、匯款明細截圖，以便交易方核實，加快交易的進行',
    hint_cny_5: '我已詳細閱讀並同意配合驗證',
    hint_cny_6: '為確保交易雙方帳戶安全，請於交易對話窗上傳',
    hint_cny_7: '提供後，交易方將提供完整轉帳資料',
    hint_cny_8: '24小時內銀行流水帳截圖',
    wallet1: '請確認您所選擇的協議種類',
    wallet2: '請確保所選協議種類與接收錢包或交易所的協議種類相符。',
    wallet3: '否則您將無法找回已丟失的加密貨幣。',
    cancel: '資料將不會儲存，需重新輸入資料',
    bank_hint: '請務必確保您所輸入的資料，與您的銀行帳戶資訊一致。'
  },
  btn: {
    next_step: '下一步',
    confirm_transfer: '確認轉出',
    cancel: '取消'
  },
  isTwenty: {
    agree: '我已滿20歲 已閱讀並同意',
    disclaimer: '免責聲明',
    terms: '使用條款',
    privacy: '隱私權條款'
  }
};
