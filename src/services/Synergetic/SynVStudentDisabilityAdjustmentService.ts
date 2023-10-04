import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iSynVStudentDisabilityAdjustment from '../../types/Synergetic/iSynVStudentDisabilityAdjustment';

const endPoint = '/syn/vStudentDisabilityAdjustment';
const getAll = (params: iConfigParams = {}): Promise<iPaginatedResult<iSynVStudentDisabilityAdjustment>> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynVtudentDisabilityAdjustmentService = {
  getAll,
}

export default SynVtudentDisabilityAdjustmentService;
