import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuSkillService from '../../../../services/Synergetic/Lookup/SynLuSkillService';

describe('SynLuSkillService', () => {
  const endPoint = '/syn/luSkill';

  ServiceTestHelper.testGetAll(endPoint, SynLuSkillService.getAll);
});
