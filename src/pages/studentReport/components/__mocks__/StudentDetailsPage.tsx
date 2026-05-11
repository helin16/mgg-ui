import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('StudentDetailsPage');

export const StudentDetailsPageKey = key;
export const StudentDetailsPageTestId = testId;

const StudentDetailsPage = ComponentTestHelper.mockComponent(
  StudentDetailsPageKey,
  StudentDetailsPageTestId
);

export default StudentDetailsPage;
