import ComponentTestHelper from '../../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('MonthlyBillingReportPanel');

export const MonthlyBillingReportPanelKey = key;
export const MonthlyBillingReportPanelTestId = testId;

const MonthlyBillingReportPanel = ComponentTestHelper.mockComponent(
  MonthlyBillingReportPanelKey,
  MonthlyBillingReportPanelTestId
);

export default MonthlyBillingReportPanel;
