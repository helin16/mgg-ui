import { MGGS_MODULE_ID_MGG_APP_DEVICES } from "../../types/modules/iModuleUser";
import AdminPage from "../../layouts/AdminPage";
import AdminPageTabs from "../../layouts/AdminPageTabs";

type iMggDevicesAdminPage = {
  onNavBack: () => void;
};
const MggDevicesAdminPage = ({ onNavBack }: iMggDevicesAdminPage) => {
  return (
    <AdminPage
      title={<h3>MGG Internal App Devices - Admin</h3>}
      onNavBack={onNavBack}
      moduleId={MGGS_MODULE_ID_MGG_APP_DEVICES}
    >
      <AdminPageTabs moduleId={MGGS_MODULE_ID_MGG_APP_DEVICES} />
    </AdminPage>
  );
};

export default MggDevicesAdminPage;
