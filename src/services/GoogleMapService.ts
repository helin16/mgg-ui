import appService, {iConfigParams} from './AppService';
import {AxiosRequestConfig} from 'axios';
import iGoogleMapSuggestion from '../types/Google/iGoogleMapSuggestion';

const endPoint = '/googleMap';
const getSuggestions = (searchTxt: string, params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iGoogleMapSuggestion> => {
  return appService.get(`${endPoint}/address/autocomplete?input=${searchTxt}`, params, config).then(({data}) => data);
};


const getApiKey = (params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<{ key: string }> => {
  return appService.get(`${endPoint}/key`, params, config).then(({data}) => data);
};

const GoogleMapService = {
  getSuggestions,
  getApiKey,
}

export default GoogleMapService
