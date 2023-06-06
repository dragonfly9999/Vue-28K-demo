export default {
  name: '中文',
  locale: 'ch-HK',
  label: {
    login: '登入',
    country_code: '國碼',
    phone: '手機',
    password: '密碼',
    forget_password: '忘記密碼',
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
    instant_transaction: '及時訂單',
    notify: '通知',
    beep: '提示',
    auto: '自動接單'
  },

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
    login: '請確認您正在訪問 demo.k100.com'
  },
  country_code: {
    mask: {
      886: '請輸入十碼電話號碼',
      852: '請輸入八碼電話號碼',
      65: '請輸入八碼電話號碼',
      86: '請輸入十一碼電話號碼',
      error: '格式錯誤'
    },
    886: '台灣+886',
    852: '香港+852',
    65: '新加坡+65',
    86: '中國+86',
    84: '越南+84'
  },

  error: {
    // new
    country_code: '請選擇國碼',
    phone: '請輸入完整電話號碼',
    pass: '驗證通過',
    password: '請輸入密碼',
    complete: '尚有項目未填寫',
    account: {
      not_exist: '此號碼尚未註冊',
      exist: '此號碼已被註冊過'
    },
    verification: {
      send: '已發送驗證碼',
      error: '輸入驗證碼不相符'
    },
    avb_balance: '超過餘額',
    e401: '未能提供！！', // 不知道會是發生什麼
    titles: {
      transaction: '交易',
      change: '快速兌換',
      login: '登入',
      register: '註冊',
      dashBoard: '首頁',
      forget: '忘記密碼',
      kyc: '實名驗證',
      transfer: '轉帳',
      defaultError: '錯誤'
    },
    // ##### handler
    usdt: '交易數量不能低於100',
    isPassTwenty: '請先升到20歲',
    bankSet: '請選擇交易用銀行卡',
    inputPhone: '只能輸入數字',
    idNumber: '不能輸入特殊符號',
    qr: '現在的設備不支援相機功能',
    Agreement: '請選擇轉出協定',
    // ##### Api
    0: '成功',
    1: '發生嚴重錯誤',
    10: '帳號或密碼錯誤',
    11: '此號碼已被註冊',
    12: '創建失敗', // 建立帳號時
    13: '請完成所有的欄位', // POST 所有的API時 有參數空缺或是多餘
    14: '輸入資料格式錯誤', // POST 所有的API時
    15: 'Token 錯誤',
    16: '無效買賣',
    17: '此帳號尚未註冊',
    21: '重複發送', // 忘記密碼
    22: '簡訊驗證碼錯誤', // 建立帳號
    30: '無效的錢包地址', // 轉帳
    31: '不能轉到自己的錢包',
    32: '餘額不足', // 在賣 Usdt 時賣的數量超過可提金額
    33: '測試帳號阻擋', // 在賣 Usdt 時賣的數量超過可提金額
    90: '沒有攜帶登入驗證',
    91: '狀態已過期，請重新登入', // 這邊普遍是發生在使用者的登入過期的情況，所有在Get 的 Api 時 都會驗證使用者的登入狀況
    92: '無效使用者' // BUY / SEll Agent
  }
};
