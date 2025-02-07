import Page from "../../layouts/Page";
import AttendancesListWithSearchPanel from "../../components/Attendance/AttendancesListWithSearchPanel";
import { MGGS_MODULE_ID_ADMISSIONS } from "../../types/modules/iModuleUser";
import AdmissionsAdminPage from "./AdmissionsAdminPage";
import { Tab, Tabs } from "react-bootstrap";
import { useState } from "react";
import StudentRetainingRate from '../../components/student/StudentRetainingRate';

const TAB_BULK_EDIT_ATTENDANCES = "BULK_EDIT_ATTENDANCES";
const TAB_STUDENT_RETAINING_RATE = "STUDENT_RETAINING_RATE";
const AdmissionsPage = () => {
  const [selectedTab, setSelectedTab] = useState(TAB_BULK_EDIT_ATTENDANCES);

  return (
    <Page
      title={<h3>Admissions</h3>}
      moduleId={MGGS_MODULE_ID_ADMISSIONS}
      AdminPage={AdmissionsAdminPage}
      className={'attendances-bulk-page'}
    >
      <Tabs
        activeKey={selectedTab}
        className="mb-3"
        onSelect={k => setSelectedTab(k || TAB_BULK_EDIT_ATTENDANCES)}
        unmountOnExit
      >
        <Tab eventKey={TAB_BULK_EDIT_ATTENDANCES} title={"Bulk edit attendances"}>
          <AttendancesListWithSearchPanel />
        </Tab>
        <Tab eventKey={TAB_STUDENT_RETAINING_RATE} title={"Student Retaining Rate"}>
          <StudentRetainingRate />
        </Tab>
      </Tabs>
    </Page>
  );
};

export default AdmissionsPage;
