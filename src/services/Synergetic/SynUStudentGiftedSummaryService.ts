import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iSynUStudentGiftedSummary from '../../types/Synergetic/iSynUStudentGiftedSummary';

const endPoint = `/syn/uStudentGiftedSummary`;

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iSynUStudentGiftedSummary>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
}

const SynUStudentGiftedSummaryService = {
  getAll,
}

export default SynUStudentGiftedSummaryService;
