// utils/httpClient.ts
import axios from 'axios';

const AUTH_EXCLUDED_PATHS = ['/auth/login', '/auth/register'];

const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
  withCredentials: true 
});

httpClient.interceptors.request.use(
  config => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;

    if (isFormData) {
      // Let the browser set the correct Content-Type and boundary
      delete config.headers['Content-Type'];
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    const isExcluded = AUTH_EXCLUDED_PATHS.some(path =>
      config.url?.includes(path)
    );

    if (token && !isExcluded) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

httpClient.interceptors.response.use(
  response => response,
  error => {
    console.error('HTTP Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default httpClient;