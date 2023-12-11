import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iSBUser from '../../types/SchoolBox/iSBUser';

const endPoint = `/sb/user`;

const getAll = (params: iConfigParams = {}): Promise<iPaginatedResult<iSBUser>> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SBUserService = {
  getAll
}

export default SBUserService;
