import ComponentTestHelper from '../../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('BTUserAdminPanel');

export const BTUserAdminPanelKey = key;
export const BTUserAdminPanelTestId = testId;

const BTUserAdminPanel = ComponentTestHelper.mockComponent(
  BTUserAdminPanelKey,
  BTUserAdminPanelTestId
);

export default BTUserAdminPanel;
