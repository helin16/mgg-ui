import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('PowerBIListPanel');

export const PowerBIListPanelKey = key;
export const PowerBIListPanelTestId = testId;

const PowerBIListPanel = ComponentTestHelper.mockComponent(
  PowerBIListPanelKey,
  PowerBIListPanelTestId
);

export default PowerBIListPanel;
