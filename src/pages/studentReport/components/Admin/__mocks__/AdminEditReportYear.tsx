import ComponentTestHelper from '../../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('AdminEditReportYear');

export const AdminEditReportYearKey = key;
export const AdminEditReportYearTestId = testId;

const AdminEditReportYear = ComponentTestHelper.mockComponent(
  AdminEditReportYearKey,
  AdminEditReportYearTestId
);

export default AdminEditReportYear;
