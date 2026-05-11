import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVStudentAwardService from '../../../../services/Synergetic/Student/SynVStudentAwardService';

describe('SynVStudentAwardService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynVStudentAwardService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/vStudentAward"),
  });
});
