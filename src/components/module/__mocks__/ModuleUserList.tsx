import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('ModuleUserList');

export const ModuleUserListKey = key;
export const ModuleUserListTestId = testId;

const ModuleUserList = ComponentTestHelper.mockComponent(
  ModuleUserListKey,
  ModuleUserListTestId
);

export default ModuleUserList;
