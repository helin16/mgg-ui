import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynCommunitySkillService from '../../../../services/Synergetic/Community/SynCommunitySkillService';

describe('SynCommunitySkillService', () => {
  const endPoint = '/syn/communitySkill';

  ServiceTestHelper.testGetAll(endPoint, SynCommunitySkillService.getAll);
});
