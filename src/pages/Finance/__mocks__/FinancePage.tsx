import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('FinancePage');

export const FinancePageKey = key;
export const FinancePageTestId = testId;

const FinancePage = ComponentTestHelper.mockComponent(
  FinancePageKey,
  FinancePageTestId
);

export default FinancePage;
