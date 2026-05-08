import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('MggDevicesAdminPage');

export const MggDevicesAdminPageKey = key;
export const MggDevicesAdminPageTestId = testId;

const MggDevicesAdminPage = ComponentTestHelper.mockComponent(
  MggDevicesAdminPageKey,
  MggDevicesAdminPageTestId
);

export default MggDevicesAdminPage;
