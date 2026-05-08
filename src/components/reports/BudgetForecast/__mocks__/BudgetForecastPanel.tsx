import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('BudgetForecastPanel');

export const BudgetForecastPanelKey = key;
export const BudgetForecastPanelTestId = testId;

const BudgetForecastPanel = ComponentTestHelper.mockComponent(
  BudgetForecastPanelKey,
  BudgetForecastPanelTestId
);

export default BudgetForecastPanel;
