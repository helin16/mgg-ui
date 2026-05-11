import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynCommunityLegalService from '../../../../services/Synergetic/Community/SynCommunityLegalService';

describe('SynCommunityLegalService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynCommunityLegalService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/communityLegal"),
  });
});
