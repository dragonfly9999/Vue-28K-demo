import localforage from 'localforage';
import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';
import { logWarn } from './logger';

// Encreption
const TTL_PREFIX = '_ttl_';
const ENCRYPTION_KEY = 'PT__encryption__';
const encryptData = <Data = unknown>(data: unknown): Data => {
  if (!data) return data as Data;
  if (Array.isArray(data)) return data.map((item) => encryptData(item)) as Data;
  if (typeof data === 'object') {
    return Object.entries(data).reduce((pre, [key, value]) => {
      return { ...pre, [key]: encryptData<ValueOf<Data>>(value) };
    }, {} as Data);
  }
  if (typeof data === 'string')
    return CryptoJS.RC4.encrypt(data, ENCRYPTION_KEY).toString() as Data;
  return data as Data;
};

// 解密
const decryptData = <Data = unknown>(encryptedData: unknown): Data => {
  if (!encryptedData) return encryptedData as Data;
  if (Array.isArray(encryptedData)) {
    return encryptedData.map((item) => decryptData(item)) as Data;
  }
  if (typeof encryptedData === 'object') {
    return Object.entries(encryptedData).reduce((pre, [key, value]) => {
      return { ...pre, [key]: decryptData(value) };
    }, {} as Data);
  }

  if (typeof encryptedData === 'string') {
    try {
      const bytes = CryptoJS.RC4.decrypt(encryptedData, ENCRYPTION_KEY);
      return bytes.toString(CryptoJS.enc.Utf8) as Data;
    } catch {
      return encryptedData as Data; // Return original data if decryption fails
    }
  }
  return encryptedData as Data;
};

// forage
const forageKeys = {
  loginProps: 'loginProps',
  loginRes: 'loginRes',
  info: 'info',
};
type ForageKeys = keyof typeof forageKeys;
type ForageCallback<Forage = unknown> = (
  err?: Error | null,
  value?: Forage | null
) => void;
const forage = <Forage = unknown>() => {
  return {
    ttlKey: (key: ForageKeys) => `${TTL_PREFIX}${key}`,
    getTTL: (key: ForageKeys, callback?: ForageCallback<number>) => {
      return localforage.getItem<number>(
        forage().ttlKey(key),
        (err, ttlNum) => {
          if (callback) callback(err, ttlNum);
          if (err) logWarn({ Title: 'Get ttl number error', err });
        }
      );
    },
    getItem: (key: ForageKeys, callback?: ForageCallback<Forage>) => {
      return new Promise<Forage>((resolve) => {
        localforage.getItem<Forage>(key, (err, foragedValue) => {
          if (err) logWarn({ Title: 'Get item error', err });
          const decryptedValue = decryptData(
            foragedValue as unknown as string
          ) as Forage;
          // === normal return === //
          // if (callback) callback(err, decryptedValue);
          // return decryptedValue;

          // ttl test
          forage().getTTL(key, (ttlError, ttlNum) => {
            if (ttlError) {
              if (callback) callback(ttlError, null);
              return null;
            }
            if (ttlNum && dayjs().isAfter(dayjs(ttlNum))) {
              localforage.removeItem(key);
              if (callback) callback(ttlError, null);
              return null;
            }

            if (callback) callback(err, decryptedValue);
            resolve(decryptedValue);
            return decryptedValue;
          });
        });
      });
    },
    setItem: (
      key: ForageKeys,
      value: Forage,
      callback?: ForageCallback<Forage>,
      ttlInMinutes?: number
    ) => {
      const encryptedValue = encryptData(value);
      return localforage.setItem(key, encryptedValue, (err, foragedValue) => {
        if (err) logWarn({ Title: 'Set item error', err });
        // ttl
        if (ttlInMinutes)
          localforage.setItem(
            forage().ttlKey(key),
            dayjs().add(ttlInMinutes, 'minute').valueOf()
          );

        // forage value
        const decryptedValue = decryptData<Forage | null>(foragedValue);
        if (callback) callback(err, decryptedValue);
        return foragedValue;
      });
    },
    removeItem: (key: ForageKeys, callback?: ForageCallback<Forage>) => {
      return forage<Forage>().getItem(key, (_, item) => {
        localforage.removeItem(key, (err) => {
          localforage.removeItem(forage().ttlKey(key));
          if (callback) callback(err, item);
        });
      });
    },
    clear: (callback?: (err: Error) => void) => {
      return localforage.clear((err) => {
        if (callback) callback(err);
      });
    },
    length: (callback?: (err: Error, numOfKeys: number) => void) => {
      return localforage.length((err, numOfKeys) => {
        if (callback) callback(err, numOfKeys);
      });
    },
    key: (
      keyIndex: number,
      callback: (err: Error, key: ForageKeys) => void
    ) => {
      return localforage.key(keyIndex, (err, key) => {
        if (callback) callback(err, key as ForageKeys);
      });
    },
    keys: (calback?: (err: Error, keys: Array<ForageKeys>) => void) => {
      return localforage.keys((err, keys) => {
        if (calback) calback(err, keys as Array<ForageKeys>);
      });
    },
    iterate: (
      iteratorCallback?: (
        value: Forage | null,
        key: ForageKeys,
        iterationNum: number
      ) => void,
      callback?: (err: Error, result: void) => void
    ) => {
      return localforage.iterate(
        (value, key, iterationNum) => {
          if (iteratorCallback)
            iteratorCallback(
              value as Forage | null,
              key as ForageKeys,
              iterationNum
            );
        },
        (err, result) => {
          if (callback) callback(err, result);
        }
      );
    },
  };
};

// localstorage
const storageKey = {
  locale: 'locale', // utils\enums\WebLanguageAbbsNum
  isAgent: 'isAgent',
  phone: 'phone',
  password: 'password',
  register: 'register',
  login_session: 'login_session',
  reset_token: 'reset_token',
  verify_locker: 'verify_locker',
  forget_Info: 'forget_Info',
  to: 'to',
  codeFailedTimes: 'codeFailedTimes',
  theme: 'theme',
};
const storageHelper = <T = string>(key: keyof typeof storageKey) => {
  return {
    getItem: () => {
      const tJson = localStorage.getItem(storageKey[key]);
      if (!tJson) return null;
      try {
        const deCreyptedJson = decryptData<string>(tJson);
        if (!deCreyptedJson || deCreyptedJson === 'undefined') return null;
        const t: T = JSON.parse(deCreyptedJson);
        return t;
      } catch (e) {
        logWarn({ Title: "Can't parse this storage", tJson, key, e });
      }
      return null;
    },
    setItem: (item: T) => {
      if (item instanceof Function) {
        logWarn({ Title: 'Cant set function item ', item });
        return;
      }
      const itemJson = JSON.stringify(item);
      const jsonEncrypted = encryptData<string>(itemJson);
      localStorage.setItem(storageKey[key], jsonEncrypted);
    },
    remove: () => {
      localStorage.removeItem(key);
    },
  };
};

// reset
const resetForages = (callback?: () => void) => {
  localforage.clear(() => {
    localStorage.clear();
    if (callback) callback();
  });
};

export { forageKeys, forage, storageKey, storageHelper, resetForages };
