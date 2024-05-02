export default {
  input: {
    countryCode: 'Please select country code',
    phone: 'Invalid phone number format',
    password: 'Please enter password',
    re_password: 'Passwords do not match',
    empty: 'Field cannot be empty'
  },
  api: {
    0: 'Success',
    1: 'Serious error occurred',
    10: 'Incorrect account or password',
    11: 'This number is already registered',
    12: 'Creation failed', // When creating an account
    13: 'Please complete all fields', // When posting to APIs with missing or extra parameters
    14: 'Data format error', // When posting to APIs with wrong data format
    15: 'Token error',
    16: 'Invalid transaction',
    17: 'This account is not registered yet',
    21: 'Resend', // Forgot password
    22: 'SMS verification code error', // When creating an account
    30: 'Invalid wallet address', // Transfer
    31: 'Cannot transfer to own wallet',
    32: 'Insufficient balance', // When selling Usdt and the quantity exceeds the available amount for withdrawal
    33: 'Test account blocked', // When selling Usdt and the quantity exceeds the available amount for withdrawal
    35: 'Account information not set',
    41: 'Single transaction quantity exceeds member level limit',
    90: 'Login verification not provided',
    91: 'Session expired, please login again', // This generally happens when user's login session expires. All Get APIs validate user's login status
    92: 'Invalid user' // BUY / SEll Agent
  },
  請重新註冊: 'Please re-register',
  圖片上傳失敗: 'Failed to upload image',
  simple_input: 'Please enter the field',
  country_code: 'Please select country code',
  phone: 'Please enter complete phone number',
  pass: 'Verification Passed',
  password: 'Incorrect password',
  complete: 'Some items are not filled in',
  account: {
    not_exist: 'This number is not registered yet',
    exist: 'This number has already been registered'
  },
  verification: {
    send: 'Verification code sent',
    error: 'Incorrect verification code entered'
  },
  請輸入購買數量: 'Please enter purchase quantity',
  avb_balance: 'Exceeds available balance',
  e401: 'Unable to provide!!',
  titles: {
    transaction: 'Transaction',
    change: 'Quick Exchange',
    login: 'Login',
    register: 'Register',
    dashBoard: 'Dashboard',
    forget: 'Forgot Password',
    kyc: 'KYC Verification',
    transfer: 'Transfer',
    defaultError: 'Error'
  },
  // ##### handler
  usdt: 'Transaction quantity cannot be less than 100',
  isPassTwenty: 'Please reach the age of 20 first',
  bankSet: 'Please select trading bank card',
  inputPhone: 'Only numbers can be entered',
  idNumber: 'Cannot enter special characters',
  qr: 'The current device does not support camera function',
  Agreement: 'Please select transfer agreement'
};
