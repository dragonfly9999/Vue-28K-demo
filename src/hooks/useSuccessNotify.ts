import { Notify } from 'quasar';

export default (message: string) => {
  Notify.create({
    type: 'info',
    message,
    caption: 'K28 New System',
    position: 'top',
    timeout: 2000,
  });
};
