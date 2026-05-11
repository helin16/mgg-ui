import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynStudentYearService from '../../../../services/Synergetic/Student/SynStudentYearService';

describe('SynStudentYearService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynStudentYearService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/studentYear"),
  });
});
