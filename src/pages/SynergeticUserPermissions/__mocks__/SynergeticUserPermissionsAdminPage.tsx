import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('SynergeticUserPermissionsAdminPage');

export const SynergeticUserPermissionsAdminPageKey = key;
export const SynergeticUserPermissionsAdminPageTestId = testId;

const SynergeticUserPermissionsAdminPage = ComponentTestHelper.mockComponent(
  SynergeticUserPermissionsAdminPageKey,
  SynergeticUserPermissionsAdminPageTestId
);

export default SynergeticUserPermissionsAdminPage;
