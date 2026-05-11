import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynVActivityService from '../../../services/Synergetic/SynVActivityService';

describe('SynVActivityService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAllById',
    serviceFn: SynVActivityService.getAllById,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/syn/vActivity"),
  });
});
