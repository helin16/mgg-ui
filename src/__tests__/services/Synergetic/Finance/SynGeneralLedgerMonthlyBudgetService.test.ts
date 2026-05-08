import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynGeneralLedgerMonthlyBudgetService from '../../../../services/Synergetic/Finance/SynGeneralLedgerMonthlyBudgetService';

describe('SynGeneralLedgerMonthlyBudgetService', () => {
  const endPoint = '/syn/generalLedgerMonthlyBudget';

  ServiceTestHelper.testGetAll(endPoint, SynGeneralLedgerMonthlyBudgetService.getAll);
  ServiceTestHelper.testCustom({
    name: 'getAllByYearAndGLCode',
    serviceFn: SynGeneralLedgerMonthlyBudgetService.getAllByYearAndGLCode,
    appMethod: 'get',
    callArgs: ["123", "value", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/generalLedgerMonthlyBudget/123/value", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
