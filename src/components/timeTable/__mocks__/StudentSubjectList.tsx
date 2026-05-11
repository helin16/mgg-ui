import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('StudentSubjectList');

export const StudentSubjectListKey = key;
export const StudentSubjectListTestId = testId;

const StudentSubjectList = ComponentTestHelper.mockComponent(
  StudentSubjectListKey,
  StudentSubjectListTestId
);

export default StudentSubjectList;
