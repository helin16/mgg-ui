import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynJobPositionService from '../../../../services/Synergetic/Staff/SynJobPositionService';

describe('SynJobPositionService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynJobPositionService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/jobPosition", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
