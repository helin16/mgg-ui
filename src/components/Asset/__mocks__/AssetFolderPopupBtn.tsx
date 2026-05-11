import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('AssetFolderPopupBtn');

export const AssetFolderPopupBtnKey = key;
export const AssetFolderPopupBtnTestId = testId;

const AssetFolderPopupBtn = ComponentTestHelper.mockComponent(
  AssetFolderPopupBtnKey,
  AssetFolderPopupBtnTestId
);

export default AssetFolderPopupBtn;
