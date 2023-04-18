import AppService, {iConfigParams} from '../AppService';
import iSynLuForm from '../../types/Synergetic/iSynLuForm';

const endPoint = '/syn/luForm/';

const getAll = (params: iConfigParams = {}): Promise<iSynLuForm[]> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynLuFormService = {
  getAll
}

export default SynLuFormService;
