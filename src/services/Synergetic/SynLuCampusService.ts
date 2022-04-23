import AppService, {iConfigParams} from '../AppService';
import iLuCampus from '../../types/Synergetic/iLuCampus';

const getAllCampuses = (params: iConfigParams = {}): Promise<iLuCampus[]> => {
  return AppService.get(`/syn/luCampus`, params).then(resp => resp.data);
};

const SynLuCampusService = {
  getAllCampuses
}

export default SynLuCampusService;
