import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVGeneralLedgerService from '../../../../services/Synergetic/Finance/SynVGeneralLedgerService';

describe('SynVGeneralLedgerService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynVGeneralLedgerService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/vGeneralLedger"),
  });
});
