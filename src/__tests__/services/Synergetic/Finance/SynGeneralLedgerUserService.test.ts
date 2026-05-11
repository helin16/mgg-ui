import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynGeneralLedgerUserService from '../../../../services/Synergetic/Finance/SynGeneralLedgerUserService';

describe('SynGeneralLedgerUserService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynGeneralLedgerUserService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/generalLedgerUser"),
  });
});
