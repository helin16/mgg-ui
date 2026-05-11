import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynStudentClassesHistoryService from '../../../../services/Synergetic/Student/SynStudentClassesHistoryService';

describe('SynStudentClassesHistoryService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynStudentClassesHistoryService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/studentClassesHistory"),
  });
});
