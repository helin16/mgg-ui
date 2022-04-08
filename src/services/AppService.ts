import axios, {AxiosRequestConfig} from 'axios';
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

const get = (url: string, params: iConfigParams = {}, config: AxiosRequestConfig = {}) => {
  return axios.get(
    `${getEndPointUrl(url)}${getUrlParams(params)}`,
    {
      ...config,
      ...getHeaders()
    },
  );
};

const post = (url: string, params: iParams, config: AxiosRequestConfig = {}) => {
  return axios.post(getEndPointUrl(url), params, {
    ...config,
    ...getHeaders()
  });
};

const put = (url: string, params: iConfigParams, config: AxiosRequestConfig = {}) => {
  return axios.put(getEndPointUrl(url), params, {
    ...config,
    ...getHeaders()
  });
};

const remove = (url: string, params: iConfigParams = {}, config: AxiosRequestConfig = {}) => {
  return axios.delete(
    `${getEndPointUrl(url)}${getUrlParams(params)}`,
    {
      ...config,
      ...getHeaders()
    }
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
const uploadImage = (url: string, params: FormData, config: AxiosRequestConfig = {}) => {
  return axios.post(getEndPointUrl(url), params, {
    ...config,
    ...getUploadHeaders()
  });
};

const AppService = {
  get,
  post,
  put,
  delete: remove,
  uploadImage,
};

export default AppService;
