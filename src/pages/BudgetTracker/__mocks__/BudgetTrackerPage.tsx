import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('BudgetTrackerPage');

export const BudgetTrackerPageKey = key;
export const BudgetTrackerPageTestId = testId;

const BudgetTrackerPage = ComponentTestHelper.mockComponent(
  BudgetTrackerPageKey,
  BudgetTrackerPageTestId
);

export default BudgetTrackerPage;
