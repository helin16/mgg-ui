import axios, { AxiosRequestConfig } from "axios";
import LocalStorageService from "./LocalStorageService";
import UtilsService from "./UtilsService";
import iPaginatedResult from "../types/iPaginatedResult";

export const HEADER_NAME_APP_TOKEN = "X-MGGS-TOKEN";
export const HEADER_NAME_SELECTING_FIELDS = "X-MGGS-SELECT-FIELDS";

export type iConfigParams = {
  [key: string]: any;
};
export type iParams = iConfigParams;

const cancelToken = axios.CancelToken;

const getEndPointUrl = (url: string) => {
  return `${process.env.REACT_APP_API_END_POINT}${url}`;
};

const getHeaders = (extra = {}) => {
  const token = LocalStorageService.getToken();
  const authHeader =
    !token || token === "" ? {} : { Authorization: `Bearer ${token}` };
  return {
    headers: {
      [HEADER_NAME_APP_TOKEN]: `${process.env.REACT_APP_TOKEN || ""}`,
      ...authHeader,
      ...extra
    }
  };
};

const get = (
  url: string,
  params: iConfigParams = {},
  config: AxiosRequestConfig = {}
) => {
  const { headers, ...rest } = config;
  return axios.get(
    `${getEndPointUrl(url)}${UtilsService.getUrlParams(params)}`,
    // @ts-ignore
    {
      ...rest,
      ...getHeaders(headers)
    }
  );
};

const post = (
  url: string,
  params: iParams,
  config: AxiosRequestConfig = {}
) => {
  const { headers, ...rest } = config;
  // @ts-ignore
  return axios.post(getEndPointUrl(url), params, {
    ...rest,
    ...getHeaders(headers)
  });
};

const put = (
  url: string,
  params: iConfigParams,
  config: AxiosRequestConfig = {}
) => {
  const { headers, ...rest } = config;
  // @ts-ignore
  return axios.put(getEndPointUrl(url), params, {
    ...rest,
    ...getHeaders(headers)
  });
};

const remove = (
  url: string,
  params: iConfigParams = {},
  config: AxiosRequestConfig = {}
) => {
  const { headers, ...rest } = config;
  return axios.delete(
    `${getEndPointUrl(url)}${UtilsService.getUrlParams(params)}`,
    // @ts-ignore
    {
      ...rest,
      ...getHeaders(headers)
    }
  );
};
const getUploadHeaders = () => {
  const headers = getHeaders();
  return {
    headers: {
      ...headers,
      "Content-Type": "multipart/form-data"
    }
  };
};
const uploadImage = (
  url: string,
  params: FormData,
  config: AxiosRequestConfig = {}
) => {
  // @ts-ignore
  return axios.post(getEndPointUrl(url), params, {
    ...config,
    ...getUploadHeaders()
  });
};

const cancelAll = () => {
  return cancelToken.source().cancel();
};

const convertArrToPaginatedArr = <T extends {}>(
  arr: T[] | iPaginatedResult<T>
): iPaginatedResult<T> => {
  if (Array.isArray(arr)) {
    return {
      data: arr,
      currentPage: 1,
      perPage: 1,
      from: 0,
      to: arr.length,
      total: arr.length,
      pages: 1
    }
  }

  return arr;
};

const AppService = {
  get,
  post,
  put,
  delete: remove,
  uploadImage,
  cancelAll,
  getEndPointUrl,
  convertArrToPaginatedArr
};

export default AppService;
