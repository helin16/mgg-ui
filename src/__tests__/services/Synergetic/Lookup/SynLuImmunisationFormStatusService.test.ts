import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuImmunisationFormStatusService from '../../../../services/Synergetic/Lookup/SynLuImmunisationFormStatusService';

describe('SynLuImmunisationFormStatusService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuImmunisationFormStatusService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/syn/luImmunisationFormStatus", {"fakeParams":"value"}],
  });
});
