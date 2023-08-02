import AppService, {iConfigParams} from '../../AppService';
import ISynLuCampus from '../../../types/Synergetic/Lookup/iSynLuCampus';

const getAllCampuses = (params: iConfigParams = {}): Promise<ISynLuCampus[]> => {
  return AppService.get(`/syn/luCampus`, params).then(resp => resp.data);
};

const SynLuCampusService = {
  getAllCampuses
}

export default SynLuCampusService;
