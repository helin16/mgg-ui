import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('SynergeticUserPermissionsPage');

export const SynergeticUserPermissionsPageKey = key;
export const SynergeticUserPermissionsPageTestId = testId;

const SynergeticUserPermissionsPage = ComponentTestHelper.mockComponent(
  SynergeticUserPermissionsPageKey,
  SynergeticUserPermissionsPageTestId
);

export default SynergeticUserPermissionsPage;
