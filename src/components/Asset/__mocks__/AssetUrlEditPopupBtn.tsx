import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('AssetUrlEditPopupBtn');

export const AssetUrlEditPopupBtnKey = key;
export const AssetUrlEditPopupBtnTestId = testId;

const AssetUrlEditPopupBtn = ComponentTestHelper.mockComponent(
  AssetUrlEditPopupBtnKey,
  AssetUrlEditPopupBtnTestId
);

export default AssetUrlEditPopupBtn;
