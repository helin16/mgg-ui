import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynTagListService from '../../../../services/Synergetic/Tag/SynTagListService';

describe('SynTagListService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynTagListService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/tagList"),
  });
});
