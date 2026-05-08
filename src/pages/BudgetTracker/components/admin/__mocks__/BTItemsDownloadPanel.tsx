import ComponentTestHelper from '../../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('BTItemsDownloadPanel');

export const BTItemsDownloadPanelKey = key;
export const BTItemsDownloadPanelTestId = testId;

const BTItemsDownloadPanel = ComponentTestHelper.mockComponent(
  BTItemsDownloadPanelKey,
  BTItemsDownloadPanelTestId
);

export default BTItemsDownloadPanel;
