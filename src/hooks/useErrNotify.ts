import { Notify } from 'quasar';

export default (message: string) => {
  Notify.create({
    type: 'negative',
    message,
    caption: 'K28 xxx',
    color: 'red-6',
    timeout: 2000,
    position: 'top-right',
  });
};
