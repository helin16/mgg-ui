import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynVStaffService from '../../../services/Synergetic/SynVStaffService';

describe('SynVStaffService', () => {
  ServiceTestHelper.testCustom({
    name: 'getStaffList',
    serviceFn: SynVStaffService.getStaffList,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/syn/vStaff", {"fakeParams":"value"}],
  });
});
