import AppService, {iConfigParams} from '../../AppService';
import iSynLuMedicalConditionType from '../../../types/Synergetic/Lookup/iSynLuMedicalConditionType';

const endPoint = '/syn/luMedicalConditionType';

const getAllMedicalConditionTypes = (params: iConfigParams = {}): Promise<iSynLuMedicalConditionType[]> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynLuMedicalConditionTypeService = {
  getAllMedicalConditionTypes
}

export default SynLuMedicalConditionTypeService;
