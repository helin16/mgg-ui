import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVStudentClassService from '../../../../services/Synergetic/Student/SynVStudentClassService';

describe('SynVStudentClassService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynVStudentClassService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/vStudentClass"),
  });
});
