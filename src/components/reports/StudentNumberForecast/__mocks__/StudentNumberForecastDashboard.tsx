import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('StudentNumberForecastDashboard');

export const StudentNumberForecastDashboardKey = key;
export const StudentNumberForecastDashboardTestId = testId;

const StudentNumberForecastDashboard = ComponentTestHelper.mockComponent(
  StudentNumberForecastDashboardKey,
  StudentNumberForecastDashboardTestId
);

export default StudentNumberForecastDashboard;
