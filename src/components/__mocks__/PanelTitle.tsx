import ComponentTestHelper from '../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('PanelTitle');

export const PanelTitleKey = key;
export const PanelTitleTestId = testId;

const PanelTitle = ComponentTestHelper.mockComponent(
  PanelTitleKey,
  PanelTitleTestId
);

export default PanelTitle;
