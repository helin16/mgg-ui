import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import StudentContactService from '../../../../services/Synergetic/Student/StudentContactService';

describe('StudentContactService', () => {
  ServiceTestHelper.testCustom({
    name: 'getStudentContacts',
    serviceFn: StudentContactService.getStudentContacts,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/studentContact"),
  });
});
