import appService, {iConfigParams} from '../AppService';
import {AxiosRequestConfig} from 'axios';
import iHouseAwardEvent from '../../types/HouseAwards/iHouseAwardEvent';

const endPoint = '/houseAwards/event';

const getEvents = (params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iHouseAwardEvent[]> => {
  return appService.get(endPoint, params, config).then(({data}) => data);
};

const getEvent = (id: number | string, params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iHouseAwardEvent[]> => {
  return appService.get(`${endPoint}/${id}`, params, config).then(({data}) => data);
};

const createEvent = (params: iConfigParams, config: AxiosRequestConfig = {}): Promise<iHouseAwardEvent[]> => {
  return appService.post(endPoint, params, config).then(({data}) => data);
};

const updateEvent = (id: number | string, params: iConfigParams, config: AxiosRequestConfig = {}): Promise<iHouseAwardEvent[]> => {
  return appService.put(`${endPoint}/${id}`, params, config).then(({data}) => data);
};


const deleteEvent = (id: number | string, params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iHouseAwardEvent[]> => {
  return appService.delete(`${endPoint}/${id}`, params, config).then(({data}) => data);
};

const HouseAwardEventService = {
  getEvent,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
}

export default HouseAwardEventService;
