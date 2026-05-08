import ComponentTestHelper from '../../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('AdminEditingLockList');

export const AdminEditingLockListKey = key;
export const AdminEditingLockListTestId = testId;

const AdminEditingLockList = ComponentTestHelper.mockComponent(
  AdminEditingLockListKey,
  AdminEditingLockListTestId
);

export default AdminEditingLockList;
