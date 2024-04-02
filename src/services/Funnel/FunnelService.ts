import appService, {iConfigParams} from '../AppService';
import {AxiosRequestConfig} from 'axios';
import iMessage from '../../types/Message/iMessage';
import iFunnelLead from '../../types/Funnel/iFunnelLead';
import iPaginatedResult from '../../types/iPaginatedResult';

const endPoint = '/funnel';

export const FUNNEL_ADMIN_URL = 'https://mggs-au-vic-254.app.digistorm.com/admin/login';

const getAll = (params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iPaginatedResult<iFunnelLead>> => {
  return appService.get(endPoint, params, config).then(({data}) => data);
};
const download = (params: iConfigParams = {}, config: AxiosRequestConfig = {}): Promise<iMessage> => {
  return appService.post(`${endPoint}/download`, params, config).then(({data}) => data);
};

const FunnelService = {
  getAll,
  download,
}

export default FunnelService;
