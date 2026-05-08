import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynVDebtorStudentConcession from '../../../types/Synergetic/Finance/iSynVDebtorStudentConcession';

const endPoint = '/syn/vDebtorStudentConcession';

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iSynVDebtorStudentConcession>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const SynVDebtorStudentConcessionService = {
  getAll,
};

export default SynVDebtorStudentConcessionService;
