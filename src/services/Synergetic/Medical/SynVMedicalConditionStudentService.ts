import AppService, {iConfigParams} from '../../AppService';
import iSynVMedicalConditionStudent from '../../../types/Synergetic/iSynVMedicalConditionStudent';

const endPoint = '/syn/vMedicalConditionStudent';

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iSynVMedicalConditionStudent[]> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const SynVMedicalConditionStudentService = {
  getAll,
}

export default SynVMedicalConditionStudentService;
