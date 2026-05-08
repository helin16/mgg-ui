import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('StudentSubjectListModuleSettings');

export const StudentSubjectListModuleSettingsKey = key;
export const StudentSubjectListModuleSettingsTestId = testId;

const StudentSubjectListModuleSettings = ComponentTestHelper.mockComponent(
  StudentSubjectListModuleSettingsKey,
  StudentSubjectListModuleSettingsTestId
);

export default StudentSubjectListModuleSettings;
