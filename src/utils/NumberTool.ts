type NumOptions = string | number | null | undefined;

const thousandTool = (num?: NumOptions, digits?: number): string => {
  if (!num) return '0';

  const pureNumber = numberTool(num);

  const result = pureNumber.toFixed(digits).split('.');
  result[0] = result[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return result.join('.');
};
const numberTool = (num: NumOptions): number => {
  if (!num) return 0;

  const cleanComma = num.toString().split(',').join('');
  return Number(cleanComma);
};

const thousandInput = (num: NumOptions): string | null => {
  if (num === null) return null;
  if (!num) return '0';
  const pureNumber = numberTool(num);

  if (isNaN(pureNumber)) return null;

  const result = pureNumber.toString().split('.');
  result[0] = result[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return result.join('.');
};

export enum MasterTypeNum {
  Buy,
  Sell,
  TransOut,
  TransIn
}

export { thousandTool, numberTool, thousandInput };
