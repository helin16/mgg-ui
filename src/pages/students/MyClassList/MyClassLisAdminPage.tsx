import AdminPage, {AdminPageProps} from '../../../layouts/AdminPage';
import { MGGS_MODULE_ID_MY_CLASS_LIST} from '../../../types/modules/iModuleUser';
import AdminPageTabs from '../../../layouts/AdminPageTabs';

const MyClassListAdminPage = ({ onNavBack }: AdminPageProps) => {
  return (
    <AdminPage
      onNavBack={onNavBack}
      title={<h3>My Class List - Admin</h3>}
      moduleId={MGGS_MODULE_ID_MY_CLASS_LIST}
    >
      <AdminPageTabs
        moduleId={MGGS_MODULE_ID_MY_CLASS_LIST}
      />
    </AdminPage>
  );
};

export default MyClassListAdminPage;
