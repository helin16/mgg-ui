import appService, {iConfigParams} from './AppService';
import {AxiosRequestConfig} from 'axios';
import iPaginatedResult from '../types/iPaginatedResult';
import iMessage from '../types/Message/iMessage';

const getMessages = (params?: iConfigParams, config: AxiosRequestConfig = {}): Promise<iPaginatedResult<iMessage>> => {
  return appService.get(`/message`, params, config).then(({data}) => data);
};

const MessageService = {
  getMessages,
}

export default MessageService
