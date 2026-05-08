import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iClipboardTeam from '../../types/Clipboard/iClipboardTeam';

const endPoint = '/clipboard/team';

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iClipboardTeam>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const get = (id: string | number, params: iConfigParams = {}, config?: iConfigParams): Promise<iClipboardTeam> => {
  return AppService.get(`${endPoint}/${id}`, params, config).then(resp => resp.data);
};

const ClipboardTeamService = {
  getAll,
  get,
};

export default ClipboardTeamService;
