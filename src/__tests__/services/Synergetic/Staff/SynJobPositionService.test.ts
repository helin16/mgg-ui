import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynJobPositionService from '../../../../services/Synergetic/Staff/SynJobPositionService';

describe('SynJobPositionService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynJobPositionService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/jobPosition"),
  });
});
