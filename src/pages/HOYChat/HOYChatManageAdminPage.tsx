import { MGGS_MODULE_ID_HOY_CHAT_EMAIL } from "../../types/modules/iModuleUser";
import AdminPage, { AdminPageProps } from "../../layouts/AdminPage";
import AdminPageTabs from "../../layouts/AdminPageTabs";
import HOYChatModuleSettings from "./components/HOYChatModuleSettings";
import MessageListPanel from '../../components/common/Message/MessageListPanel';
import {MESSAGE_TYPE_HOY_CHAT_EMAIL} from '../../types/Message/iMessage';

const HOYChatManageAdminPage = ({ onNavBack }: AdminPageProps) => {
  return (
    <AdminPage
      title={<h3>HOY Chat Management Admin</h3>}
      onNavBack={onNavBack}
      moduleId={MGGS_MODULE_ID_HOY_CHAT_EMAIL}
    >
      <AdminPageTabs
        moduleId={MGGS_MODULE_ID_HOY_CHAT_EMAIL}
        extraTabs={[
          {
            key: "settings",
            title: "Settings",
            component: <HOYChatModuleSettings />
          },
          {
            key: "logs",
            title: "Email Logs",
            component: <MessageListPanel type={MESSAGE_TYPE_HOY_CHAT_EMAIL} />
          }
        ]}
      />
    </AdminPage>
  );
};

export default HOYChatManageAdminPage;
