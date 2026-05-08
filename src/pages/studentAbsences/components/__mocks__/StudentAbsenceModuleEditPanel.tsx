import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('StudentAbsenceModuleEditPanel');

export const StudentAbsenceModuleEditPanelKey = key;
export const StudentAbsenceModuleEditPanelTestId = testId;

const StudentAbsenceModuleEditPanel = ComponentTestHelper.mockComponent(
  StudentAbsenceModuleEditPanelKey,
  StudentAbsenceModuleEditPanelTestId
);

export default StudentAbsenceModuleEditPanel;
