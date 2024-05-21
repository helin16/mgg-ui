import Page from "../../layouts/Page";
import AttendancesListWithSearchPanel from "../../components/Attendance/AttendancesListWithSearchPanel";
import { MGGS_MODULE_ID_ADMISSIONS } from "../../types/modules/iModuleUser";
import AttendanceBulkChangeAdminPage from "./AttendanceBulkChangeAdminPage";

const AttendanceBulkChangePage = () => {
  return (
    <Page
      title={<h3>Bulk edit attendances</h3>}
      moduleId={MGGS_MODULE_ID_ADMISSIONS}
      AdminPage={AttendanceBulkChangeAdminPage}
    >
      <AttendancesListWithSearchPanel />
    </Page>
  );
};

export default AttendanceBulkChangePage;
