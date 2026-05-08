import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuRelationshipService from '../../../../services/Synergetic/Lookup/SynLuRelationshipService';

describe('SynLuRelationshipService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuRelationshipService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/luRelationship", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
