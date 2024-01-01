import { Notify } from 'quasar';

export default (message: string) => {
  Notify.create({
    type: 'info',
    message,
    caption: 'K100U.com',
    position: 'top-right',
    timeout: 2000
  });
};
