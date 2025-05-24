import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const getBaseURL = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8080/api';
    } else if (Platform.OS === 'ios') {
      return 'http://localhost:8080/api';
    } else {
      return 'http://localhost:8080/api';
    }
  } else {
    return 'https://seu-servidor.com/api';
  }
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const isAuthRoute = error.config?.url?.includes('/auth/');
      
      if (!isAuthRoute) {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('user');
      }
      
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

export const setCustomBaseURL = (url: string) => {
  api.defaults.baseURL = url;
};

export const getCurrentBaseURL = () => {
  return api.defaults.baseURL;
};

export default api;