import AdminPage from "../../layouts/AdminPage";
import AdminPageTabs from '../../layouts/AdminPageTabs';
import {MGGS_MODULE_ID_STAFF_LIST} from '../../types/modules/iModuleUser';

type iStaffListAdminPage = {
  onNavBack: () => void;
};
const StaffListAdminPage = ({ onNavBack }: iStaffListAdminPage) => {
  return (
    <AdminPage onNavBack={onNavBack} title={<h3>Staff List - Admin</h3>} moduleId={MGGS_MODULE_ID_STAFF_LIST}>
      <AdminPageTabs moduleId={MGGS_MODULE_ID_STAFF_LIST} />
    </AdminPage>
  );
};

export default StaffListAdminPage;
