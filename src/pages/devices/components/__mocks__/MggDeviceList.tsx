import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('MggDeviceList');

export const MggDeviceListKey = key;
export const MggDeviceListTestId = testId;

const MggDeviceList = ComponentTestHelper.mockComponent(
  MggDeviceListKey,
  MggDeviceListTestId
);

export default MggDeviceList;
