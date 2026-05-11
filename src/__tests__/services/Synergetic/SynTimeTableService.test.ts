import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynTimeTableService from '../../../services/Synergetic/SynTimeTableService';

describe('SynTimeTableService', () => {
  ServiceTestHelper.testCustom({
    name: 'importTimeTable',
    serviceFn: SynTimeTableService.importTimeTable,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/timeTable/import"),
  });
  ServiceTestHelper.testCustom({
    name: 'getStudentSubjects',
    serviceFn: SynTimeTableService.getStudentSubjects,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/syn/timeTable/studentSubjects"),
  });
});
