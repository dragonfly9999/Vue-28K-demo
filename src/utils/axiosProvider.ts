import axios from 'axios';
import { useStorage } from 'vue3-storage';

const storage = useStorage();
const axiosProvider = axios.create({
  baseURL: import.meta.env.VITE_API_BASE
});


axiosProvider.interceptors.request.use((config) => {
  const loginSession = storage.getStorageSync('login_session');
  if (loginSession) {
    config.headers['login_session'] = `${loginSession}`;
  }
  return config;
});

export { axiosProvider };
