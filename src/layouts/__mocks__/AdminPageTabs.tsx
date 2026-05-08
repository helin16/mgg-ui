import ComponentTestHelper from '../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('AdminPageTabs');

export const AdminPageTabsKey = key;
export const AdminPageTabsTestId = testId;

const AdminPageTabs = ComponentTestHelper.mockComponent(
  AdminPageTabsKey,
  AdminPageTabsTestId
);

export default AdminPageTabs;
