import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('SynergeticUserPermissionsPanel');

export const SynergeticUserPermissionsPanelKey = key;
export const SynergeticUserPermissionsPanelTestId = testId;

const SynergeticUserPermissionsPanel = ComponentTestHelper.mockComponent(
  SynergeticUserPermissionsPanelKey,
  SynergeticUserPermissionsPanelTestId
);

export default SynergeticUserPermissionsPanel;
