import axios, {AxiosRequestConfig} from 'axios';
import LocalStorageService from './LocalStorageService';

export type iConfigParams = {
  [key: string]: string;
};
export type iParams = {
  [key: string]: string | boolean | number | null | undefined | string[];
};

const getEndPointUrl = (url: string) => {
  return `${process.env.REACT_APP_API_END_POINT}${url}`;
};

const getHeaders = () => {
  const token = LocalStorageService.getToken();
  const authHeader = (!token || token === '') ? {} : {Authorization: `Bearer ${token}`};
  return {
    headers: {
      'X-MGGS-TOKEN': `${process.env.REACT_APP_TOKEN || ''}`,
      ...authHeader,
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
    // @ts-ignore
    {
      ...config,
      ...getHeaders()
    },
  );
};

const post = (url: string, params: iParams, config: AxiosRequestConfig = {}) => {
  // @ts-ignore
  return axios.post(getEndPointUrl(url), params, {
    ...config,
    ...getHeaders()
  });
};

const put = (url: string, params: iConfigParams, config: AxiosRequestConfig = {}) => {
  // @ts-ignore
  return axios.put(getEndPointUrl(url), params, {
    ...config,
    ...getHeaders()
  });
};

const remove = (url: string, params: iConfigParams = {}, config: AxiosRequestConfig = {}) => {
  return axios.delete(
    `${getEndPointUrl(url)}${getUrlParams(params)}`,
    // @ts-ignore
    {
      ...config,
      ...getHeaders()
    }
  );
};
const getUploadHeaders = () => {
  const headers = getHeaders();
  return {
    headers: {
      ...headers,
      'Content-Type': 'multipart/form-data',
    },
  };
};
const uploadImage = (url: string, params: FormData, config: AxiosRequestConfig = {}) => {
  // @ts-ignore
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
