import AppService from '../AppService';

const endPoint = '/hoyChat';

type iSend = {
  contactReason: string;
  comments: string;
  attachments?: string[];
}
const submitForm = async (data: iSend) => {
  return AppService.post(`${endPoint}/send`, data).then(resp => resp.data);
};

const HOYChatService = {
  submitForm
}

export default HOYChatService;
