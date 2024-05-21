import Page from "../../layouts/Page";
import AttendancesListWithSearchPanel from "../../components/Attendance/AttendancesListWithSearchPanel";
import { MGGS_MODULE_ID_ADMISSIONS } from "../../types/modules/iModuleUser";
import AdmissionsAdminPage from "./AdmissionsAdminPage";
import { Tab, Tabs } from "react-bootstrap";
import { useState } from "react";

const TAB_BULK_EDIT_ATTENDANCES = "BULK_EDIT_ATTENDANCES";
const AdmissionsPage = () => {
  const [selectedTab, setSelectedTab] = useState(TAB_BULK_EDIT_ATTENDANCES);

  return (
    <Page
      title={<h3>Admissions</h3>}
      moduleId={MGGS_MODULE_ID_ADMISSIONS}
      AdminPage={AdmissionsAdminPage}
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
      </Tabs>
    </Page>
  );
};

export default AdmissionsPage;
