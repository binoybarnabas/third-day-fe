// utils/api.ts
import httpClient from './httpClient';
export const get = async <T>(url: string, config = {}) => {
  const res = await httpClient.get<T>(url, config);
  return {
    status: res.status,
    data: res.data,
  };
};

export const post = async <T>(url: string, data: any, config = {}) => {
  const res = await httpClient.post<T>(url, data, config);
  return {
    status: res.status,
    data: res.data,
  };
};

export const put = async <T>(url: string, data: any, config = {}) => {
  const res = await httpClient.put<T>(url, data, config);
  return {
    status: res.status,
    data: res.data,
  };
};

export const del = async <T>(url: string, config = {}) => {
  const res = await httpClient.delete<T>(url, config);
  return {
    status: res.status,
    data: res.data,
  };
};