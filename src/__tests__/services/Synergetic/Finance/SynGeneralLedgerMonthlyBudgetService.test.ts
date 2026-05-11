import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import TestHelper from '../../../helper/TestHelper';
import SynGeneralLedgerMonthlyBudgetService from '../../../../services/Synergetic/Finance/SynGeneralLedgerMonthlyBudgetService';

describe('SynGeneralLedgerMonthlyBudgetService', () => {
  const {fakeId, fakeParams, fakeConfig} = TestHelper.getFakeParams();
  const fakeYear = TestHelper.faker.date.anytime().getFullYear().toString();

  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynGeneralLedgerMonthlyBudgetService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/syn/generalLedgerMonthlyBudget"),
  });
  ServiceTestHelper.testCustom({
    name: 'getAllByYearAndGLCode',
    serviceFn: SynGeneralLedgerMonthlyBudgetService.getAllByYearAndGLCode,
    appMethod: 'get',
    callArgs: [fakeId, fakeYear, fakeParams, fakeConfig],
    expectedArgs: [`/syn/generalLedgerMonthlyBudget/${fakeId}/${fakeYear}`, fakeParams, fakeConfig],
  });
});
