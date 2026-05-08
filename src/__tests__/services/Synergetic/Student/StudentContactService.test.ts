import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import StudentContactService from '../../../../services/Synergetic/Student/StudentContactService';

describe('StudentContactService', () => {
  ServiceTestHelper.testCustom({
    name: 'getStudentContacts',
    serviceFn: StudentContactService.getStudentContacts,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/studentContact", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
