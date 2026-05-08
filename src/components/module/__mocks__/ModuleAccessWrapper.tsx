import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('ModuleAccessWrapper');

export const ModuleAccessWrapperKey = key;
export const ModuleAccessWrapperTestId = testId;

const ModuleAccessWrapper = ComponentTestHelper.mockComponent(
  ModuleAccessWrapperKey,
  ModuleAccessWrapperTestId
);

export default ModuleAccessWrapper;
