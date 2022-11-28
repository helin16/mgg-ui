import appService, {iConfigParams} from '../AppService';
import {AxiosRequestConfig} from 'axios';
import iHouseAwardEventType from '../../types/HouseAwards/iHouseAwardEventType';

const endPoint = '/houseAwards/eventType';

const getEventTypes = (params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iHouseAwardEventType[]> => {
  return appService.get(endPoint, params, config).then(({data}) => data);
};

const getEventType = (id: string | number, params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iHouseAwardEventType> => {
  return appService.get(`${endPoint}/${id}`, params, config).then(({data}) => data);
};

const createEventType = (params: iConfigParams, config: AxiosRequestConfig = {}): Promise<iHouseAwardEventType> => {
  return appService.post(endPoint, params, config).then(({data}) => data);
};

const updateEventType = (id: string | number, params: iConfigParams, config: AxiosRequestConfig = {}): Promise<iHouseAwardEventType> => {
  return appService.put(`${endPoint}/${id}`, params, config).then(({data}) => data);
};

const deleteEventType = (id: string | number, params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iHouseAwardEventType> => {
  return appService.delete(`${endPoint}/${id}`, params, config).then(({data}) => data);
};

const HouseAwardEventTypeService = {
  getEventTypes,
  getEventType,
  createEventType,
  updateEventType,
  deleteEventType,
}

export default HouseAwardEventTypeService;
