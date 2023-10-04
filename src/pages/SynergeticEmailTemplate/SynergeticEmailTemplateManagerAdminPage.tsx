import AdminPage, { AdminPageProps } from "../../layouts/AdminPage";
import { MGGS_MODULE_ID_SYN_EMAIL_TEMPLATE } from "../../types/modules/iModuleUser";
import AdminPageTabs from '../../layouts/AdminPageTabs';

const SynergeticEmailTemplateManagerAdminPage = ({
  onNavBack
}: AdminPageProps) => {
  return (
    <AdminPage
      onNavBack={onNavBack}
      moduleId={MGGS_MODULE_ID_SYN_EMAIL_TEMPLATE}
      title={<h3>Synergetic Email Template Manager - Admin</h3>}
    >
      <AdminPageTabs moduleId={MGGS_MODULE_ID_SYN_EMAIL_TEMPLATE} />
    </AdminPage>
  );
};

export default SynergeticEmailTemplateManagerAdminPage;
