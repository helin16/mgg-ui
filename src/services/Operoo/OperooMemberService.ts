import appService, {iConfigParams} from '../AppService';
import {AxiosRequestConfig} from 'axios';
import iPaginatedResult from '../../types/iPaginatedResult';
import iOperooSafetyAlert from '../../types/Operoo/iOperooSafetyAlert';

const getMemberDetails = (synId: number | string, params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iPaginatedResult<iOperooSafetyAlert>> => {
  return appService.get(`/operoo/member/${synId}`, params, config).then(({data}) => data);
};

export default {
  getMemberDetails
}
