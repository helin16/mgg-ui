import ComponentTestHelper from '../../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('BTLockDownAdminPanel');

export const BTLockDownAdminPanelKey = key;
export const BTLockDownAdminPanelTestId = testId;

const BTLockDownAdminPanel = ComponentTestHelper.mockComponent(
  BTLockDownAdminPanelKey,
  BTLockDownAdminPanelTestId
);

export default BTLockDownAdminPanel;
