import { Notify } from 'quasar';

export default (message: string) => {
  Notify.create({
    type: 'info',
    message,
    caption: 'K100u com',
    timeout: 6000,
    position: 'right'
  });
};
