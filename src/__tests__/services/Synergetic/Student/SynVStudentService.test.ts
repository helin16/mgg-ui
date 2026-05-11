import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import TestHelper from '../../../helper/TestHelper';
import SynVStudentService from '../../../../services/Synergetic/Student/SynVStudentService';

describe('SynVStudentService', () => {
  const {fakeId, fakeParams} = TestHelper.getFakeParams();
  const fakeSearchText = TestHelper.faker.person.firstName();

  ServiceTestHelper.testCustom({
    name: 'getCurrentVStudents',
    serviceFn: SynVStudentService.getCurrentVStudents,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/vStudent/current/"),
  });
  ServiceTestHelper.testCustom({
    name: 'searchVStudents',
    serviceFn: SynVStudentService.searchVStudents,
    appMethod: 'get',
    callArgs: [fakeSearchText, fakeParams],
    expectedArgs: ['/syn/vStudent', {...fakeParams, searchTxt: fakeSearchText}],
  });
  ServiceTestHelper.testCustom({
    name: 'getCurrentVStudent',
    serviceFn: SynVStudentService.getCurrentVStudent,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgsWithId(),
    expectedArgs: [`/syn/vStudent/current/${fakeId}`, fakeParams],
  });
  ServiceTestHelper.testCustom({
    name: 'getVStudentAll',
    serviceFn: SynVStudentService.getVStudentAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/vStudent/all"),
  });
  ServiceTestHelper.testCustom({
    name: 'getVPastStudentAll',
    serviceFn: SynVStudentService.getVPastStudentAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/vStudent/pastAll"),
  });
  ServiceTestHelper.testCustom({
    name: 'getVPastAndCurrentStudentAll',
    serviceFn: SynVStudentService.getVPastAndCurrentStudentAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/vStudent/pastAndCurrentAll"),
  });
});
