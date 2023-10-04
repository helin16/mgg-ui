import SchoolDataSubmissionsAdminPage from "./SchoolDataSubmissionsAdminPage";
import { MGGS_MODULE_ID_SCHOOL_DATA_SUBMISSION } from "../../types/modules/iModuleUser";
import SchoolDataSubmissionsPanel from "./components/SchoolDataSubmissionsPanel";
import Page from "../../layouts/Page";

const SchoolDataSubmissionsPage = () => {
  return (
    <Page
      className={"school-data-submission-page"}
      moduleId={MGGS_MODULE_ID_SCHOOL_DATA_SUBMISSION}
      AdminPage={SchoolDataSubmissionsAdminPage}
      title={<h3>School Data Submission</h3>}
    >
      <SchoolDataSubmissionsPanel />
    </Page>
  );
};

export default SchoolDataSubmissionsPage;
