import AdminPage, {AdminPageProps} from '../../layouts/AdminPage';
import {MGGS_MODULE_ID_ENROLMENTS} from '../../types/modules/iModuleUser';
import AdminPageTabs from '../../layouts/AdminPageTabs';
import EnrolmentManagementAdminSettings from './components/EnrolmentManagementAdminSettings';

const EnrolmentManagementAdminPage = ({onNavBack}: AdminPageProps) => {
  return (
    <AdminPage title={<h3>Enrolments Manager - Admin</h3>} onNavBack={onNavBack} moduleId={MGGS_MODULE_ID_ENROLMENTS}>
      <AdminPageTabs moduleId={MGGS_MODULE_ID_ENROLMENTS} extraTabs={[{
        key: 'settings',
        title: 'Settings',
        component: <EnrolmentManagementAdminSettings />
      }]}/>
    </AdminPage>
  )
}

export default EnrolmentManagementAdminPage;
