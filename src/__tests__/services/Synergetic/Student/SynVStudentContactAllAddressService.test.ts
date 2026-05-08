import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVStudentContactAllAddressService from '../../../../services/Synergetic/Student/SynVStudentContactAllAddressService';

describe('SynVStudentContactAllAddressService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynVStudentContactAllAddressService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/vStudentContactAllAddress", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
