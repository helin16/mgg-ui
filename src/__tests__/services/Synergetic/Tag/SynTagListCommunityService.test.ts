import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynTagListCommunityService from '../../../../services/Synergetic/Tag/SynTagListCommunityService';

describe('SynTagListCommunityService', () => {
  const endPoint = '/syn/tagListCommunity';

  ServiceTestHelper.testGetAll(endPoint, SynTagListCommunityService.getAll);
});
