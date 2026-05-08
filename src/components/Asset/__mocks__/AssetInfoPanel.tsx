import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('AssetInfoPanel');

export const AssetInfoPanelKey = key;
export const AssetInfoPanelTestId = testId;

const AssetInfoPanel = ComponentTestHelper.mockComponent(
  AssetInfoPanelKey,
  AssetInfoPanelTestId
);

export default AssetInfoPanel;
