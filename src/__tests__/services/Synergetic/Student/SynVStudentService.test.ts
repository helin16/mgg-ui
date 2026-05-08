import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVStudentService from '../../../../services/Synergetic/Student/SynVStudentService';

describe('SynVStudentService', () => {
  ServiceTestHelper.testCustom({
    name: 'getCurrentVStudents',
    serviceFn: SynVStudentService.getCurrentVStudents,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/vStudent/current/", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'searchVStudents',
    serviceFn: SynVStudentService.searchVStudents,
    appMethod: 'get',
    callArgs: ["search", {"fakeParams":"value"}],
    expectedArgs: ["/syn/vStudent", {"fakeParams":"value","searchTxt":"search"}],
  });
  ServiceTestHelper.testCustom({
    name: 'getCurrentVStudent',
    serviceFn: SynVStudentService.getCurrentVStudent,
    appMethod: 'get',
    callArgs: ["123", {"fakeParams":"value"}],
    expectedArgs: ["/syn/vStudent/current/123", {"fakeParams":"value"}],
  });
  ServiceTestHelper.testCustom({
    name: 'getVStudentAll',
    serviceFn: SynVStudentService.getVStudentAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/vStudent/all", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'getVPastStudentAll',
    serviceFn: SynVStudentService.getVPastStudentAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/vStudent/pastAll", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'getVPastAndCurrentStudentAll',
    serviceFn: SynVStudentService.getVPastAndCurrentStudentAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/vStudent/pastAndCurrentAll", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
