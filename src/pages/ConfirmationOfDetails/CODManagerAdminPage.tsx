import {MGGS_MODULE_ID_COD} from '../../types/modules/iModuleUser';
import AdminPage, {AdminPageProps} from '../../layouts/AdminPage';
import AdminPageTabs from '../../layouts/AdminPageTabs';
import CODManagementAdminSettings from './admin/CODManagementAdminSettings';

const CODManagerAdminPage = ({onNavBack}: AdminPageProps) => {
  return (
    <AdminPage
      onNavBack={onNavBack}
      title={<h3>C.O.D. Manger - Admin</h3>}
      moduleId={MGGS_MODULE_ID_COD}
    >
      <AdminPageTabs moduleId={MGGS_MODULE_ID_COD} extraTabs={[{
        key: 'settings',
        title: 'Settings',
        component: <CODManagementAdminSettings />
      }]}/>
    </AdminPage>
  )
}

export default CODManagerAdminPage;
