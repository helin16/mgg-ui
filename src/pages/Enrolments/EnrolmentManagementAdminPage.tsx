import AdminPage, {AdminPageProps} from '../../layouts/AdminPage';
import {MGGS_MODULE_ID_ENROLMENTS} from '../../types/modules/iModuleUser';
import AdminPageTabs from '../../layouts/AdminPageTabs';

const EnrolmentManagementAdminPage = ({onNavBack}: AdminPageProps) => {
  return (
    <AdminPage title={<h3>Enrolments Manager - Admin</h3>} onNavBack={onNavBack} moduleId={MGGS_MODULE_ID_ENROLMENTS}>
      <AdminPageTabs moduleId={MGGS_MODULE_ID_ENROLMENTS} />
    </AdminPage>
  )
}

export default EnrolmentManagementAdminPage;
