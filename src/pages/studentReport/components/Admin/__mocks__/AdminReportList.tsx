import ComponentTestHelper from '../../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('AdminReportList');

export const AdminReportListKey = key;
export const AdminReportListTestId = testId;

const AdminReportList = ComponentTestHelper.mockComponent(
  AdminReportListKey,
  AdminReportListTestId
);

export default AdminReportList;
