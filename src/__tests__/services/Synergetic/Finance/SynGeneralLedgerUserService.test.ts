import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynGeneralLedgerUserService from '../../../../services/Synergetic/Finance/SynGeneralLedgerUserService';

describe('SynGeneralLedgerUserService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynGeneralLedgerUserService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/generalLedgerUser", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
