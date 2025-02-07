import axios from 'axios';
import { storageHelper } from './foragePkg';

const axiosProvider = axios.create({
  baseURL: import.meta.env.VITE_API_BASE
});


axiosProvider.interceptors.request.use((config) => {
  const loginSession = storageHelper('login_session').getItem();
  if (loginSession) {
    config.headers['login_session'] = `${loginSession}`;
  }
  return config;
});

export { axiosProvider };
