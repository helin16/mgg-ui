import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iClipboardSession from '../../types/Clipboard/iClipboardSession';

const endPoint = '/clipboard/session';

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iClipboardSession>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const get = (id: string | number, params: iConfigParams = {}, config?: iConfigParams): Promise<iClipboardSession> => {
  return AppService.get(`${endPoint}/${id}`, params, config).then(resp => resp.data);
};

const ClipboardSessionService = {
  getAll,
  get,
};

export default ClipboardSessionService;
