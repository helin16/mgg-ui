import Page from '../../layouts/Page';
import {MGGS_MODULE_ID_SYNERGETIC_USER_PERMISSIONS} from '../../types/modules/iModuleUser';
import SynergeticUserPermissionsAdminPage from './SynergeticUserPermissionsAdminPage';
import SynergeticUserPermissionsPanel from './components/SynergeticUserPermissionsPanel';

const SynergeticUserPermissionsPage = () => {
  return (
    <Page
      title={<h3>Synergetic User Permissions</h3>}
      moduleId={MGGS_MODULE_ID_SYNERGETIC_USER_PERMISSIONS}
      AdminPage={SynergeticUserPermissionsAdminPage}
      className={'synergetic-user-permissions-page'}
    >
      <SynergeticUserPermissionsPanel />
    </Page>
  );
};

export default SynergeticUserPermissionsPage;
