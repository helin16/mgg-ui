import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('EnrolmentManagementAdminPage');

export const EnrolmentManagementAdminPageKey = key;
export const EnrolmentManagementAdminPageTestId = testId;

const EnrolmentManagementAdminPage = ComponentTestHelper.mockComponent(
  EnrolmentManagementAdminPageKey,
  EnrolmentManagementAdminPageTestId
);

export default EnrolmentManagementAdminPage;
