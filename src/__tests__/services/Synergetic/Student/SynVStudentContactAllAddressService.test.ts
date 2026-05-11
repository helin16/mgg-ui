import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVStudentContactAllAddressService from '../../../../services/Synergetic/Student/SynVStudentContactAllAddressService';

describe('SynVStudentContactAllAddressService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynVStudentContactAllAddressService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/vStudentContactAllAddress"),
  });
});
