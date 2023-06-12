import { AccNum } from './api';

type EditProps = {
  H_id: number;
  AccKey: typeof AccNum;
  value: string;
  initValue: string;
};

const handleSaveEdit = ({H_id,AccKey,value,initValue}: EditProps) => {
  if(value !== initValue) {
    
  }
};
