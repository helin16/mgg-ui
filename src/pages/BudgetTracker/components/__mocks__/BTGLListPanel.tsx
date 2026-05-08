import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('BTGLListPanel');

export const BTGLListPanelKey = key;
export const BTGLListPanelTestId = testId;

const BTGLListPanel = ComponentTestHelper.mockComponent(
  BTGLListPanelKey,
  BTGLListPanelTestId
);

export default BTGLListPanel;
