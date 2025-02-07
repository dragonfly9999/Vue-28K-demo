export default {
  input: {
    countryCode: '請選擇國碼',
    phone: '號碼格式不正確',
    password: '請輸入密碼',
    re_password: '密碼不相符',
    empty: '欄位不能為空'
  },
  api: {
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
    35: '未設定帳戶資訊',
    41: '超出會員等級之單筆可交易數量',
    43: 'OTP 驗證失敗',
    90: '沒有攜帶登入驗證',
    91: '狀態已過期，請重新登入', // 這邊普遍是發生在使用者的登入過期的情況，所有在Get 的 Api 時 都會驗證使用者的登入狀況
    92: '無效使用者' // BUY / SEll Agent
  },
  請重新註冊: '請重新註冊',
  圖片上傳失敗: '圖片上傳失敗',
  simple_input: '請輸入欄位',
  country_code: '請選擇國碼',
  phone: '請輸入完整電話號碼',
  pass: '驗證通過',
  password: '密碼錯誤',
  complete: '尚有項目未填寫',
  account: {
    not_exist: '此號碼尚未註冊',
    exist: '此號碼已被註冊過'
  },
  verification: {
    send: '已發送驗證碼',
    error: '輸入驗證碼不相符'
  },
  請輸入購買數量: '請輸入購買數量',
  avb_balance: '超過餘額',
  e401: '未能提供！！',
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
  Agreement: '請選擇轉出協定'
};
