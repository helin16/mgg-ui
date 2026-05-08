import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('BTGLDetailsPanel');

export const BTGLDetailsPanelKey = key;
export const BTGLDetailsPanelTestId = testId;

const BTGLDetailsPanel = ComponentTestHelper.mockComponent(
  BTGLDetailsPanelKey,
  BTGLDetailsPanelTestId
);

export default BTGLDetailsPanel;
