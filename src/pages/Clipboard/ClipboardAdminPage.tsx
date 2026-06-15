import { MGGS_MODULE_ID_CLIPBOARD } from "../../types/modules/iModuleUser";
import AdminPage from "../../layouts/AdminPage";
import AdminPageTabs from "../../layouts/AdminPageTabs";
import ClipboardMusicSyncLogsPanel from "./components/ClipboardMusicSyncLogsPanel";

type iClipboardAdminPage = {
  onNavBack: () => void;
};

const ClipboardAdminPage = ({ onNavBack }: iClipboardAdminPage) => {
  return (
    <AdminPage title={<h3>Clipboard Admin</h3>} onNavBack={onNavBack} moduleId={MGGS_MODULE_ID_CLIPBOARD}>
      <AdminPageTabs 
        moduleId={MGGS_MODULE_ID_CLIPBOARD}
        extraTabs={[{
          key: 'logs',
          title: 'Logs',
          component: <ClipboardMusicSyncLogsPanel />
        }]}
      />
    </AdminPage>
  );
};

export default ClipboardAdminPage;
