import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuLanguageService from '../../../../services/Synergetic/Lookup/SynLuLanguageService';

describe('SynLuLanguageService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuLanguageService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/syn/luLanguage"),
  });
});
