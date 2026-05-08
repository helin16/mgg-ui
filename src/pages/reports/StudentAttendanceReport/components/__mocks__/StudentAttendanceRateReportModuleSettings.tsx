import ComponentTestHelper from '../../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('StudentAttendanceRateReportModuleSettings');

export const StudentAttendanceRateReportModuleSettingsKey = key;
export const StudentAttendanceRateReportModuleSettingsTestId = testId;

const StudentAttendanceRateReportModuleSettings = ComponentTestHelper.mockComponent(
  StudentAttendanceRateReportModuleSettingsKey,
  StudentAttendanceRateReportModuleSettingsTestId
);

export default StudentAttendanceRateReportModuleSettings;
