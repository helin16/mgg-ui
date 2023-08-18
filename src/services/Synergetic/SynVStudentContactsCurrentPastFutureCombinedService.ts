import AppService, {iConfigParams} from '../AppService';
import iSynVStudentContactsCurrentPastFutureCombined
  from '../../types/Synergetic/iSynVStudentContactsCurrentPastFutureCombined';
import iPaginatedResult from '../../types/iPaginatedResult';

const endPoint = `/syn/vStudentContactsCurrentPastFutureCombined`;

const getAll = (params: iConfigParams = {}): Promise<iPaginatedResult<iSynVStudentContactsCurrentPastFutureCombined>> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SynVStudentContactsCurrentPastFutureCombinedService = {
  getAll,
}

export default SynVStudentContactsCurrentPastFutureCombinedService;
