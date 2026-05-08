import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynGeneralLedgerService from '../../../../services/Synergetic/Finance/SynGeneralLedgerService';

describe('SynGeneralLedgerService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynGeneralLedgerService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/syn/generalLedger", {"fakeParams":"value"}],
  });
});
