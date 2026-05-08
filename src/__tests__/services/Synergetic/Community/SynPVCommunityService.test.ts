import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynPVCommunityService from '../../../../services/Synergetic/Community/SynPVCommunityService';

describe('SynPVCommunityService', () => {
  const endPoint = '/syn/pvCommunity';

  ServiceTestHelper.testGetAll(endPoint, SynPVCommunityService.getAll);
});
