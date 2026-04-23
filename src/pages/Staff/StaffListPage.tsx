import StaffListPanel from "../../components/staff/StaffListPanel";
import { MGGS_MODULE_ID_STAFF_LIST } from "../../types/modules/iModuleUser";
import Page from "../../layouts/Page";
import StaffListAdminPage from './StaffListAdminPage';

const StaffListPage = () => {
  return (
    <Page
      title={<h3>Staff List</h3>}
      moduleId={MGGS_MODULE_ID_STAFF_LIST}
      AdminPage={StaffListAdminPage}
    >
      <StaffListPanel />
    </Page>
  );
};

export default StaffListPage;
