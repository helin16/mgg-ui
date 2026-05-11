import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynRelationshipService from '../../../../services/Synergetic/Community/SynRelationshipService';

describe('SynRelationshipService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynRelationshipService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/relationship"),
  });
});
