import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuQualificationLevelService from '../../../../services/Synergetic/Lookup/SynLuQualificationLevelService';

describe('SynLuQualificationLevelService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuQualificationLevelService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/syn/luQualificationLevel", {"fakeParams":"value"}],
  });
});
