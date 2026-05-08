import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('ModuleAdminBtn');

export const ModuleAdminBtnKey = key;
export const ModuleAdminBtnTestId = testId;

const ModuleAdminBtn = ComponentTestHelper.mockComponent(
  ModuleAdminBtnKey,
  ModuleAdminBtnTestId
);

export default ModuleAdminBtn;
