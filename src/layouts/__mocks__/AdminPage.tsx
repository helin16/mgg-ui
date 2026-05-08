import ComponentTestHelper from '../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('AdminPage');

export const AdminPageKey = key;
export const AdminPageTestId = testId;

const AdminPage = ComponentTestHelper.mockComponent(
  AdminPageKey,
  AdminPageTestId
);

export default AdminPage;
