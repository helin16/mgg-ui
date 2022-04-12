import AppService, {iConfigParams} from '../AppService';
import iPaginatedResult from '../../types/iPaginatedResult';
import iSBSubmissionReturn from '../../types/SchoolBox/iSBSubmissionReturn';

const endPoint = `/sb/submissionReturn`;

const getSubmissionReturns = (params: iConfigParams = {}): Promise<iPaginatedResult<iSBSubmissionReturn>> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const SBSubmissionReturnService = {
  getSubmissionReturns
}

export default SBSubmissionReturnService;
