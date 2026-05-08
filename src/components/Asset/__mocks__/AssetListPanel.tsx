import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('AssetListPanel');

export const AssetListPanelKey = key;
export const AssetListPanelTestId = testId;

const AssetListPanel = ComponentTestHelper.mockComponent(
  AssetListPanelKey,
  AssetListPanelTestId
);

export default AssetListPanel;
