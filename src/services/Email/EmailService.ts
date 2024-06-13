import appService, {iConfigParams} from '../AppService';
import {AxiosRequestConfig} from 'axios';

const endPoint = '/email';

const sendHtml = (params: iConfigParams = {}, config: AxiosRequestConfig = {}): Promise<{success: boolean}> => {
  return appService.post(`${endPoint}/send/html`, params, config).then(({data}) => data);
};

const MailGunService = {
  sendHtml,
}

export default MailGunService;
