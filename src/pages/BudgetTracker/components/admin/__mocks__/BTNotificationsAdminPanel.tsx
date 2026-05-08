import ComponentTestHelper from '../../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('BTNotificationsAdminPanel');

export const BTNotificationsAdminPanelKey = key;
export const BTNotificationsAdminPanelTestId = testId;

const BTNotificationsAdminPanel = ComponentTestHelper.mockComponent(
  BTNotificationsAdminPanelKey,
  BTNotificationsAdminPanelTestId
);

export default BTNotificationsAdminPanel;
