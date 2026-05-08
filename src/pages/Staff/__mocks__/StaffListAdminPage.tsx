import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('StaffListAdminPage');

export const StaffListAdminPageKey = key;
export const StaffListAdminPageTestId = testId;

const StaffListAdminPage = ComponentTestHelper.mockComponent(
  StaffListAdminPageKey,
  StaffListAdminPageTestId
);

export default StaffListAdminPage;
