import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuAbsenceReasonService from '../../../../services/Synergetic/Lookup/SynLuAbsenceReasonService';

describe('SynLuAbsenceReasonService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuAbsenceReasonService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/syn/luAbsenceReason/"),
  });
});
