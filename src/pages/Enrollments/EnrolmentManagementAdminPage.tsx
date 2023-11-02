import AdminPage, {AdminPageProps} from '../../layouts/AdminPage';
import {MGGS_MODULE_ID_ENROLLMENTS} from '../../types/modules/iModuleUser';
import AdminPageTabs from '../../layouts/AdminPageTabs';
import EnrolmentManagementAdminSettings from './components/EnrolmentManagementAdminSettings';
import MessageListPanel from '../../components/common/Message/MessageListPanel';
import {MESSAGE_TYPE_EXPIRING_PASSPORTS_OR_VISAS} from '../../types/Message/iMessage';

const EnrolmentManagementAdminPage = ({onNavBack}: AdminPageProps) => {
  return (
    <AdminPage title={<h3>ENROLLMENTS Manager - Admin</h3>} onNavBack={onNavBack} moduleId={MGGS_MODULE_ID_ENROLLMENTS}>
      <AdminPageTabs moduleId={MGGS_MODULE_ID_ENROLLMENTS} extraTabs={[{
        key: 'settings',
        title: 'Settings',
        component: <EnrolmentManagementAdminSettings />
      }, {
        key: 'logs',
        title: 'Logs',
        component: <MessageListPanel type={MESSAGE_TYPE_EXPIRING_PASSPORTS_OR_VISAS} />
      }]}/>
    </AdminPage>
  )
}

export default EnrolmentManagementAdminPage;
