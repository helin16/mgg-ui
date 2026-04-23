import AdminPage, {AdminPageProps} from '../../../layouts/AdminPage';
import {MGGS_MODULE_ID_POWER_BI_REPORT} from '../../../types/modules/iModuleUser';
import AdminPageTabs from '../../../layouts/AdminPageTabs';

const PowerBIReportManagerAdminPage = ({ onNavBack }: AdminPageProps) => {
  return (
    <AdminPage
      onNavBack={onNavBack}
      title={<h3>Power BI Manager - Admin</h3>}
      moduleId={MGGS_MODULE_ID_POWER_BI_REPORT}
    >
      <AdminPageTabs
        moduleId={MGGS_MODULE_ID_POWER_BI_REPORT}
      />
    </AdminPage>
  );
};

export default PowerBIReportManagerAdminPage;
