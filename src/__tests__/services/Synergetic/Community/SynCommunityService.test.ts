import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynCommunityService from '../../../../services/Synergetic/Community/SynCommunityService';

describe('SynCommunityService', () => {
  const endPoint = '/syn/community';

  ServiceTestHelper.testGetAll(endPoint, SynCommunityService.getCommunityProfiles);
});
