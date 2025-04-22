import { createI18n } from 'vue-i18n';
import en_US from './en-US';
import zh_TW from './zh-TW';
import { storageHelper } from 'src/utils/foragePkg';

export enum K28LangsNum {
  Zh_TW = 'zh-TW',
  En_US = 'en-US',
}

export const messages = {
  'en-US': en_US,
  'zh-TW': zh_TW,
};

export const langs = [
  { locale: 'en-US', name: 'English' },
  { locale: 'zh-TW', name: '繁體中文' },
  // Sth langs else in da future.....
];

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: storageHelper<K28LangsNum>('locale').getItem() ?? K28LangsNum.En_US,
  fallbackLocale: false,
  messages,
});
