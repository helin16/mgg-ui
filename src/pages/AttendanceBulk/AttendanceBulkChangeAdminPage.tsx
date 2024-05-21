import {MGGS_MODULE_ID_ADMISSIONS} from '../../types/modules/iModuleUser';
import AdminPage, {AdminPageProps} from '../../layouts/AdminPage';
import AdminPageTabs from '../../layouts/AdminPageTabs';


const AttendanceBulkChangeAdminPage = ({onNavBack}: AdminPageProps) => {
  return (
    <AdminPage title={<h3>Admissions Admin</h3>} moduleId={MGGS_MODULE_ID_ADMISSIONS} onNavBack={onNavBack}>
      <AdminPageTabs
        moduleId={MGGS_MODULE_ID_ADMISSIONS}
      />
    </AdminPage>
  )
}

export default AttendanceBulkChangeAdminPage;
