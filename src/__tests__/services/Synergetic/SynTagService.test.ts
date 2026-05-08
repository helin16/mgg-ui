import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynTagService from '../../../services/Synergetic/SynTagService';

describe('SynTagService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynTagService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/syn/tag", {"fakeParams":"value"}],
  });
});
