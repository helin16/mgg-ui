import AdminPage, {AdminPageProps} from '../../../layouts/AdminPage';
import { MGGS_MODULE_ID_MY_CLASS_LIST} from '../../../types/modules/iModuleUser';
import AdminPageTabs from '../../../layouts/AdminPageTabs';
import StudentSubjectListModuleSettings from '../../../components/timeTable/StudentSubjectListModuleSettings';

const MyClassListAdminPage = ({ onNavBack }: AdminPageProps) => {
  return (
    <AdminPage
      onNavBack={onNavBack}
      title={<h3>My Class List - Admin</h3>}
      moduleId={MGGS_MODULE_ID_MY_CLASS_LIST}
    >
      <AdminPageTabs
        moduleId={MGGS_MODULE_ID_MY_CLASS_LIST}
        extraTabs={[{
          key: 'studentBookList',
          title: 'Student Book List Settings',
          component: <StudentSubjectListModuleSettings />
        }]}
      />
    </AdminPage>
  );
};

export default MyClassListAdminPage;
