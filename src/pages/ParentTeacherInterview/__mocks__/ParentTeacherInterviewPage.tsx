import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('ParentTeacherInterviewPage');

export const ParentTeacherInterviewPageKey = key;
export const ParentTeacherInterviewPageTestId = testId;

const ParentTeacherInterviewPage = ComponentTestHelper.mockComponent(
  ParentTeacherInterviewPageKey,
  ParentTeacherInterviewPageTestId
);

export default ParentTeacherInterviewPage;
