import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynTagService from '../../../services/Synergetic/SynTagService';

describe('SynTagService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynTagService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/syn/tag"),
  });
});
