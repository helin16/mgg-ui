import AppService, {iConfigParams} from '../AppService';
import IPaginatedResult from '../../types/iPaginatedResult';
import iSynVConfigUserPermission from '../../types/Synergetic/iSynVConfigUserPermission';

const endPoint = `/syn/vConfigUserPermission`;
const getAll = (data: iConfigParams = {}, config?: iConfigParams): Promise<IPaginatedResult<iSynVConfigUserPermission>> => {
  return AppService.get(endPoint, data, config).then(resp => resp.data);
};

const SynVConfigUserPermissionService = {
  getAll
}

export default SynVConfigUserPermissionService;
