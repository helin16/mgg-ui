import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('DebitorsListPanel');

export const DebitorsListPanelKey = key;
export const DebitorsListPanelTestId = testId;

const DebitorsListPanel = ComponentTestHelper.mockComponent(
  DebitorsListPanelKey,
  DebitorsListPanelTestId
);

export default DebitorsListPanel;
