import { authLayout } from './layouts';
import { loginPage } from './pages';
export default {
  name: 'English',
  locale: 'en-US',
  ...authLayout,
  ...loginPage,
};
