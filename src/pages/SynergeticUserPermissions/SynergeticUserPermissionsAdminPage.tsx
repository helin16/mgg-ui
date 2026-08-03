import AdminPage, {AdminPageProps} from '../../layouts/AdminPage';
import AdminPageTabs from '../../layouts/AdminPageTabs';
import {MGGS_MODULE_ID_SYNERGETIC_USER_PERMISSIONS} from '../../types/modules/iModuleUser';
import SynergeticUserPermissionsSettings from './components/SynergeticUserPermissionsSettings';

const SynergeticUserPermissionsAdminPage = ({onNavBack}: AdminPageProps) => {
  return (
    <AdminPage
      title={<h3>Synergetic User Permissions Admin</h3>}
      moduleId={MGGS_MODULE_ID_SYNERGETIC_USER_PERMISSIONS}
      onNavBack={onNavBack}
    >
      <AdminPageTabs
        moduleId={MGGS_MODULE_ID_SYNERGETIC_USER_PERMISSIONS}
        extraTabs={[{
          key: 'settings',
          title: 'Settings',
          component: <SynergeticUserPermissionsSettings />,
        }]}
      />
    </AdminPage>
  );
};

export default SynergeticUserPermissionsAdminPage;
