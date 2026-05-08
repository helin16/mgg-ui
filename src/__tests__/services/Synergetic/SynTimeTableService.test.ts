import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynTimeTableService from '../../../services/Synergetic/SynTimeTableService';

describe('SynTimeTableService', () => {
  const endPoint = '/syn/timeTable';

  ServiceTestHelper.testCustom({
    name: 'importTimeTable',
    serviceFn: SynTimeTableService.importTimeTable,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/timeTable/import", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'getStudentSubjects',
    serviceFn: SynTimeTableService.getStudentSubjects,
    appMethod: 'get',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/timeTable/studentSubjects/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
