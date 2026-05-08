import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('SchoolManagementTable');

export const SchoolManagementTableKey = key;
export const SchoolManagementTableTestId = testId;

const SchoolManagementTable = ComponentTestHelper.mockComponent(
  SchoolManagementTableKey,
  SchoolManagementTableTestId
);

export default SchoolManagementTable;
