import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('CampusDisplayManagementAdminPage');

export const CampusDisplayManagementAdminPageKey = key;
export const CampusDisplayManagementAdminPageTestId = testId;

const CampusDisplayManagementAdminPage = ComponentTestHelper.mockComponent(
  CampusDisplayManagementAdminPageKey,
  CampusDisplayManagementAdminPageTestId
);

export default CampusDisplayManagementAdminPage;
