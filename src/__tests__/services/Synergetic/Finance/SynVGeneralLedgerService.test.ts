import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVGeneralLedgerService from '../../../../services/Synergetic/Finance/SynVGeneralLedgerService';

describe('SynVGeneralLedgerService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynVGeneralLedgerService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/vGeneralLedger", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
