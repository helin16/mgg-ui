import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('AssetPickupConfirm');

export const AssetPickupConfirmKey = key;
export const AssetPickupConfirmTestId = testId;

const AssetPickupConfirm = ComponentTestHelper.mockComponent(
  AssetPickupConfirmKey,
  AssetPickupConfirmTestId
);

export default AssetPickupConfirm;
