import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynCommunityLegalService from '../../../../services/Synergetic/Community/SynCommunityLegalService';

describe('SynCommunityLegalService', () => {
  const endPoint = '/syn/communityLegal';

  ServiceTestHelper.testGetAll(endPoint, SynCommunityLegalService.getAll);
});
