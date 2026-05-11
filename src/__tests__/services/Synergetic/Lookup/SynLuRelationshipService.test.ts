import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuRelationshipService from '../../../../services/Synergetic/Lookup/SynLuRelationshipService';

describe('SynLuRelationshipService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuRelationshipService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/luRelationship"),
  });
});
