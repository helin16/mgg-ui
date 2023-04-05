import appService, {iConfigParams} from '../AppService';
import {AxiosRequestConfig} from 'axios';
import iMessage from '../../types/Message/iMessage';

const endPoint = '/funnel';
const download = (params: iConfigParams = {}, config: AxiosRequestConfig = {}): Promise<iMessage> => {
  return appService.post(`${endPoint}/download`, params, config).then(({data}) => data);
};

const FunnelService = {
  download,
}

export default FunnelService;
