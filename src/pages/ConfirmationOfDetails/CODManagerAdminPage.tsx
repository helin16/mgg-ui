import {MGGS_MODULE_ID_COD} from '../../types/modules/iModuleUser';
import AdminPage, {AdminPageProps} from '../../layouts/AdminPage';
import AdminPageTabs from '../../layouts/AdminPageTabs';

const CODManagerAdminPage = ({onNavBack}: AdminPageProps) => {
  return (
    <AdminPage
      onNavBack={onNavBack}
      title={<h3>C.O.D. Manger - Admin</h3>}
      moduleId={MGGS_MODULE_ID_COD}
    >
      <AdminPageTabs moduleId={MGGS_MODULE_ID_COD} />
    </AdminPage>
  )
}

export default CODManagerAdminPage;
