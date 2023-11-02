import appService, { iConfigParams } from "../AppService";
import { AxiosRequestConfig } from "axios";
import iPaginatedResult from "../../types/iPaginatedResult";
import iConfirmationOfDetailsResponse from "../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse";

const endPoint = "/cod/response";

const getAll = (
  params?: iConfigParams,
  config: AxiosRequestConfig = {}
): Promise<iPaginatedResult<iConfirmationOfDetailsResponse>> => {
  return appService.get(endPoint, params, config).then(({ data }) => data);
};

const get = (
  id: number | string,
  params?: iConfigParams,
  config: AxiosRequestConfig = {}
): Promise<iConfirmationOfDetailsResponse> => {
  return appService
    .get(`${endPoint}/${id}`, params, config)
    .then(({ data }) => data);
};

const create = (
  params: iConfigParams,
  config: AxiosRequestConfig = {}
): Promise<iConfirmationOfDetailsResponse> => {
  return appService.post(endPoint, params, config).then(({ data }) => data);
};

const update = (
  id: number | string,
  params: iConfigParams,
  config: AxiosRequestConfig = {}
): Promise<iConfirmationOfDetailsResponse> => {
  return appService
    .put(`${endPoint}/${id}`, params, config)
    .then(({ data }) => data);
};

const deactivate = (
  id: number | string,
  params?: iConfigParams,
  config: AxiosRequestConfig = {}
): Promise<iConfirmationOfDetailsResponse> => {
  return appService
    .delete(`${endPoint}/${id}`, params, config)
    .then(({ data }) => data);
};

const ConfirmationOfDetailsResponseService = {
  getAll,
  get,
  create,
  update,
  deactivate
};

export default ConfirmationOfDetailsResponseService;
