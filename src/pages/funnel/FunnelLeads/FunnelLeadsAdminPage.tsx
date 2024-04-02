import AdminPage, {AdminPageProps} from '../../../layouts/AdminPage';
import {MGGS_MODULE_ID_FUNNEL} from '../../../types/modules/iModuleUser';
import AdminPageTabs from '../../../layouts/AdminPageTabs';

const FunnelLeadsAdminPage = ({onNavBack} : AdminPageProps) => {
  return (
    <AdminPage onNavBack={onNavBack} title={<h3>Funnel Leads Admin</h3>} moduleId={MGGS_MODULE_ID_FUNNEL}>
      <AdminPageTabs moduleId={MGGS_MODULE_ID_FUNNEL} />
    </AdminPage>
  )
}

export default FunnelLeadsAdminPage;
