import ComponentTestHelper from '../../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('BTExcludeGLAdminPanel');

export const BTExcludeGLAdminPanelKey = key;
export const BTExcludeGLAdminPanelTestId = testId;

const BTExcludeGLAdminPanel = ComponentTestHelper.mockComponent(
  BTExcludeGLAdminPanelKey,
  BTExcludeGLAdminPanelTestId
);

export default BTExcludeGLAdminPanel;
