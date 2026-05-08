import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('SchoolDataSubmissionsAdminPage');

export const SchoolDataSubmissionsAdminPageKey = key;
export const SchoolDataSubmissionsAdminPageTestId = testId;

const SchoolDataSubmissionsAdminPage = ComponentTestHelper.mockComponent(
  SchoolDataSubmissionsAdminPageKey,
  SchoolDataSubmissionsAdminPageTestId
);

export default SchoolDataSubmissionsAdminPage;
