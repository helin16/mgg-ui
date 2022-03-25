import axios from 'axios';
import LocalStorageService from './LocalStorageService';

export type iConfigParams = {
  [key: string]: string;
};
type iParams = {
  [key: string]: string | boolean | number | null | undefined | string[];
};

const getEndPointUrl = (url: string) => {
  return `${process.env.REACT_APP_API_END_POINT}${url}`;
};

const getHeaders = () => {
  const token = LocalStorageService.getToken();
  if (!token || token === '') {
    return undefined;
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const getUrlParams = (params: iConfigParams = {}) => {
  const paramString =
    typeof params === 'object' && Object.keys(params).length > 0
      ? new URLSearchParams(params).toString()
      : '';
  return paramString === '' ? '' : `?${paramString}`;
};

const get = (url: string, params: iConfigParams = {}) => {
  return axios.get(
    `${getEndPointUrl(url)}${getUrlParams(params)}`,
    getHeaders(),
  );
};

const post = (url: string, params: iParams) => {
  return axios.post(getEndPointUrl(url), params, getHeaders());
};

const put = (url: string, params: iConfigParams) => {
  return axios.put(getEndPointUrl(url), params, getHeaders());
};

const remove = (url: string, params: iConfigParams = {}) => {
  return axios.delete(
    `${getEndPointUrl(url)}${getUrlParams(params)}`,
    getHeaders(),
  );
};
const getUploadHeaders = () => {
  const token = LocalStorageService.getToken();
  if (!token || token === '') {
    return undefined;
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };
};
const uploadImage = (url: string, params: FormData) => {
  return axios.post(getEndPointUrl(url), params, getUploadHeaders());
};

const AppService = {
  get,
  post,
  put,
  delete: remove,
  uploadImage,
};

export default AppService;
