import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynCommunitySkillService from '../../../../services/Synergetic/Community/SynCommunitySkillService';

describe('SynCommunitySkillService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynCommunitySkillService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/syn/communitySkill"),
  });
});
