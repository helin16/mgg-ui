import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynRelationshipService from '../../../../services/Synergetic/Community/SynRelationshipService';

describe('SynRelationshipService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynRelationshipService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/relationship", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
