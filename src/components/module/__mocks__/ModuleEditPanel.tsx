import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('ModuleEditPanel');

export const ModuleEditPanelKey = key;
export const ModuleEditPanelTestId = testId;

const ModuleEditPanel = ComponentTestHelper.mockComponent(
  ModuleEditPanelKey,
  ModuleEditPanelTestId
);

export default ModuleEditPanel;
