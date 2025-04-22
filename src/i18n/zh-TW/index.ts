import { authLayout } from './layouts';
import { loginPage } from './pages';
export default {
  name: '繁體中文',
  locale: 'zh-TW',
  ...authLayout,
  ...loginPage,
};
