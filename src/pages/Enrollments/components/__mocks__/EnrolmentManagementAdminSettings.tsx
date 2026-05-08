import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('EnrolmentManagementAdminSettings');

export const EnrolmentManagementAdminSettingsKey = key;
export const EnrolmentManagementAdminSettingsTestId = testId;

const EnrolmentManagementAdminSettings = ComponentTestHelper.mockComponent(
  EnrolmentManagementAdminSettingsKey,
  EnrolmentManagementAdminSettingsTestId
);

export default EnrolmentManagementAdminSettings;
