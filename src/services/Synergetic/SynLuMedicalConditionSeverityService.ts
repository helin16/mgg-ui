import AppService, {iConfigParams} from '../AppService';
import iSynLuMedicalConditionSeverity from '../../types/Synergetic/iSynLuMedicalConditionSeverity';

const endPoint = '/syn/luMedicalConditionSeverity';

const getAllMedicalConditionSeverities = (params: iConfigParams = {}): Promise<iSynLuMedicalConditionSeverity[]> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynLuMedicalConditionSeverityService = {
  getAllMedicalConditionSeverities
}

export default SynLuMedicalConditionSeverityService;
