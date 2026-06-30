import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('ParentTeacherInterviewModuleSettingsPanel');

export const ParentTeacherInterviewModuleSettingsPanelKey = key;
export const ParentTeacherInterviewModuleSettingsPanelTestId = testId;

const ParentTeacherInterviewModuleSettingsPanel = ComponentTestHelper.mockComponent(
  ParentTeacherInterviewModuleSettingsPanelKey,
  ParentTeacherInterviewModuleSettingsPanelTestId
);

export default ParentTeacherInterviewModuleSettingsPanel;
