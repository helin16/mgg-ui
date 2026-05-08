import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuSkillService from '../../../../services/Synergetic/Lookup/SynLuSkillService';

describe('SynLuSkillService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuSkillService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/syn/luSkill", {"fakeParams":"value"}],
  });
});
