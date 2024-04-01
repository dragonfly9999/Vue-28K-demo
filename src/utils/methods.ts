import { DigitTypes, numberTool, thousandTool } from './NumberTool';

// 轉帳頁面的百分比按鈕
const handleGetPercentage = ({ originValue, percentage, resetValue, digitType }: {
  originValue: string | null | number,
  percentage: number,
  resetValue?: unknown,
  digitType?: DigitTypes
}) => {

  if (originValue === null && resetValue === undefined) return;
  if (originValue === null) {
    resetValue = 0;
    return;
  }

  const result = thousandTool((numberTool(originValue) * percentage / 100), digitType ?? 'CNY');
  if (resetValue !== undefined) resetValue = result;
  return result
}


export default {
  handleGetPercentage,
}
