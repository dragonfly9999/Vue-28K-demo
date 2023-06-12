import dayjs from 'dayjs';

const getLeaseTime = (create?: string, deltaTime?: number) => {
  if (!deltaTime) return '-30:00';
  const totalTime = 1000 * 60 * 30;
  const useTime = dayjs(create).date() + deltaTime * 1000;
  return dayjs(totalTime - useTime).format('mm:ss');
};

const maskString = (str?: string, remain?: number) => {
  if (!str || !remain) return 0;
  const useStr = '#'.repeat(str?.length) + str?.trim()?.slice(-remain);
  return useStr.slice(-str?.length);
};
export { getLeaseTime, maskString };
