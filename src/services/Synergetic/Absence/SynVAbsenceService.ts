import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynVAbsence from '../../../types/Synergetic/Absence/iSynVAbsence';

const endPoint = '/syn/vAbsence';
const getAll = (params: iConfigParams = {}, options?: iConfigParams): Promise<iPaginatedResult<iSynVAbsence>> => {
  return AppService.get(endPoint, params, options).then(resp => resp.data);
};

const SynVAbsenceService = {
  getAll
}

export default SynVAbsenceService;
