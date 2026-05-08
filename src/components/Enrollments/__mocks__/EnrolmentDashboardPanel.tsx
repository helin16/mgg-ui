import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('EnrolmentDashboardPanel');

export const EnrolmentDashboardPanelKey = key;
export const EnrolmentDashboardPanelTestId = testId;

const EnrolmentDashboardPanel = ComponentTestHelper.mockComponent(
  EnrolmentDashboardPanelKey,
  EnrolmentDashboardPanelTestId
);

export default EnrolmentDashboardPanel;
