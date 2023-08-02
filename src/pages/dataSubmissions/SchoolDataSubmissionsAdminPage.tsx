import { MGGS_MODULE_ID_SCHOOL_DATA_SUBMISSION } from "../../types/modules/iModuleUser";
import AdminPage from "../../layouts/AdminPage";
import AdminPageTabs from "../../layouts/AdminPageTabs";

type iSchoolDataSubmissionsAdminPage = {
  onNavBack: () => void;
};
const SchoolDataSubmissionsAdminPage = ({
  onNavBack
}: iSchoolDataSubmissionsAdminPage) => {
  return (
    <AdminPage
      title={<h3>School Data Submission - Admin</h3>}
      onNavBack={onNavBack}
      moduleId={MGGS_MODULE_ID_SCHOOL_DATA_SUBMISSION}
    >
      <AdminPageTabs moduleId={MGGS_MODULE_ID_SCHOOL_DATA_SUBMISSION} />
    </AdminPage>
  );
};

export default SchoolDataSubmissionsAdminPage;
