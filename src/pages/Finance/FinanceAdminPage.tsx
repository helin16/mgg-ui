import { MGGS_MODULE_ID_FINANCE } from "../../types/modules/iModuleUser";
import FinanceAdminModuleSettings from "./components/FinanceAdminModuleSettings";
import AdminPage from "../../layouts/AdminPage";
import AdminPageTabs from "../../layouts/AdminPageTabs";

type iFinanceAdminPage = {
  onNavBack: () => void;
};
const FinanceAdminPage = ({ onNavBack }: iFinanceAdminPage) => {
  return (
    <AdminPage title={<h3>Finance Admin</h3>} onNavBack={onNavBack} moduleId={MGGS_MODULE_ID_FINANCE}>
      <AdminPageTabs moduleId={MGGS_MODULE_ID_FINANCE} extraTabs={[{
        key: 'settings',
        title: 'Settings',
        component: <FinanceAdminModuleSettings />
      }]} />
    </AdminPage>
  );
};

export default FinanceAdminPage;
