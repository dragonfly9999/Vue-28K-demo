import numbro from 'numbro';

type NumOptions = string | number | null | undefined;

export type DigitTypes = 'USDT' | 'CNY';

const thousandTool = (num?: NumOptions, digits?: DigitTypes): string => {
  if (!num) return '0';

  const pureNumber = numberTool(num);

  const useDigits = () => {
    switch (digits) {
      case 'CNY':
        return 2;
      case 'USDT':
        return 3;
      default:
        return 1;
    }
  };

  const result = pureNumber.toFixed(useDigits()).split('.');
  result[0] = result[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return result.join('.');
};
const numberTool = (num: NumOptions): number => {
  if (!num) return 0;

  const cleanComma = num.toString().split(',').join('');
  return Number(cleanComma);
};

const thousandInput = (num: NumOptions): string => {
  if (!num) return '0';
  const pureNumber = numberTool(num);

  if (isNaN(pureNumber)) return num as string;
  const result = numbro(pureNumber).format({ thousandSeparated: true });
  return result;
};

export enum MasterTypeNum {
  Buy,
  Sell,
  TransOut,
  TransIn,
}

export { thousandTool, numberTool, thousandInput };
