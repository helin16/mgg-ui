import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuAbsenceTypeService from '../../../../services/Synergetic/Lookup/SynLuAbsenceTypeService';

describe('SynLuAbsenceTypeService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuAbsenceTypeService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/syn/luAbsenceType/", {"fakeParams":"value"}],
  });
});
