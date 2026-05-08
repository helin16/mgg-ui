import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVStudentContactsCurrentPastFutureCombinedService from '../../../../services/Synergetic/Student/SynVStudentContactsCurrentPastFutureCombinedService';

describe('SynVStudentContactsCurrentPastFutureCombinedService', () => {
  const endPoint = '/syn/vStudentContactsCurrentPastFutureCombined';

  ServiceTestHelper.testGetAll(endPoint, SynVStudentContactsCurrentPastFutureCombinedService.getAll);
});
