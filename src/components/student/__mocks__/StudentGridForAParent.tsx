import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('StudentGridForAParent');

export const StudentGridForAParentKey = key;
export const StudentGridForAParentTestId = testId;

const StudentGridForAParent = ComponentTestHelper.mockComponent(
  StudentGridForAParentKey,
  StudentGridForAParentTestId
);

export default StudentGridForAParent;
