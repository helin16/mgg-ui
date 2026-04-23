import AppService, {iConfigParams} from '../../AppService';
import iSynLuAbsenceType from '../../../types/Synergetic/Absence/iSynLuAbsenceType';

const endPoint = '/syn/luAbsenceType/';

const getAll = (params: iConfigParams = {}): Promise<iSynLuAbsenceType[]> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynLuAbsenceTypeService = {
  getAll
}

export default SynLuAbsenceTypeService;
