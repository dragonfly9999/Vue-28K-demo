/* eslint-disable no-console */
type LogProps = unknown;

const logInfo = (props: LogProps, options?: { deep?: number; origin?: boolean }) => {
  const { deep, origin } = options || {};
  if (!import.meta.env.DEV || (deep && deep > 5)) return;
  if (origin) {
    console.log(props);
    return;
  }

  const repeatTimes = (deep ?? 0) * 2;
  if (['string', 'number'].includes(typeof props)) {
    console.info(`${'-'.repeat(repeatTimes)} ${props}`);
    return;
  }
  if (Array.isArray(props)) {
    console.info(`${'-'.repeat(repeatTimes)}=== Array ===`);
    logInfo(props.at(0), { deep: deep ? deep + 1 : 1 });
    return;
  }
  if (typeof props === 'object' && props) {
    Object.entries(props).forEach(([key, value]) => {
      console.info(`${'-'.repeat(repeatTimes)} ${key}: `);
      logInfo(value, { deep: deep ? deep + 1 : 1 });
    });
    return;
  }
  console.info('Result:', props);
};

const logWarn = (props: LogProps, options?: { deep?: number; origin?: boolean }) => {
  const { deep, origin } = options || {};
  if (!import.meta.env.DEV || (deep && deep > 5)) return;
  if (origin) {
    console.warn(props);
    return;
  }
  const repeatTimes = (deep ?? 0) * 2;
  if (['string', 'number'].includes(typeof props)) {
    console.warn(`${'-'.repeat(repeatTimes)} ${props} `);
    return;
  }
  if (Array.isArray(props)) {
    console.warn(`${'-'.repeat(repeatTimes)} === Array ===`);
    logWarn(props.at(0), { deep: deep ? deep + 1 : 1 });
    return;
  }
  if (typeof props === 'object' && props) {
    Object.entries(props).forEach(([key, value]) => {
      console.warn(`${'-'.repeat(repeatTimes)} ${key}: `);
      logWarn(value, { deep: deep ? deep + 1 : 1 });
    });
    return;
  }
  console.warn('Result:', props);
};

export { logInfo, logWarn };
