import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynConstituencyService from '../../../../services/Synergetic/Community/SynConstituencyService';

describe('SynConstituencyService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynConstituencyService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/constituency"),
  });
});
