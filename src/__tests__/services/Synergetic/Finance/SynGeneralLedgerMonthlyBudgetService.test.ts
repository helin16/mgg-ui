import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynGeneralLedgerMonthlyBudgetService from '../../../../services/Synergetic/Finance/SynGeneralLedgerMonthlyBudgetService';

describe('SynGeneralLedgerMonthlyBudgetService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynGeneralLedgerMonthlyBudgetService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/syn/generalLedgerMonthlyBudget", {"fakeParams":"value"}],
  });
  ServiceTestHelper.testCustom({
    name: 'getAllByYearAndGLCode',
    serviceFn: SynGeneralLedgerMonthlyBudgetService.getAllByYearAndGLCode,
    appMethod: 'get',
    callArgs: ["123", "value", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/generalLedgerMonthlyBudget/123/value", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
