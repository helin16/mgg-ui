import React from "react";
import { MGGS_MODULE_ID_OPEROO_SAFETY_ALERTS } from "../../types/modules/iModuleUser";
import { ROLE_ID_ADMIN, ROLE_ID_NORMAL } from "../../types/modules/iRole";
import ModuleUserList from "../../components/module/ModuleUserList";
import OperooDownloadPanel from "./components/Admin/OperooDownloadPanel";
import OperooSafetyAlertModuleEditPanel from "./components/Admin/OperooSafetyAlertModuleEditPanel";
import AdminPage from "../../layouts/AdminPage";
import AdminPageTabs from "../../layouts/AdminPageTabs";
import SectionDiv from "../../components/common/SectionDiv";

type iOperooSafetyAlertsAdminPage = { onNavBack: () => void };
const OperooSafetyAlertsAdminPage = ({
  onNavBack
}: iOperooSafetyAlertsAdminPage) => {
  return (
    <AdminPage
      title={<h3>Operoo Safety Alert Admin</h3>}
      onNavBack={onNavBack}
      moduleId={MGGS_MODULE_ID_OPEROO_SAFETY_ALERTS}
    >
      <AdminPageTabs
        moduleId={MGGS_MODULE_ID_OPEROO_SAFETY_ALERTS}
        usersTab={
          <SectionDiv>
            <small>
              List of users who can access this module and process alerts. They
              will receive email notifications
            </small>
            <ModuleUserList
              moduleId={MGGS_MODULE_ID_OPEROO_SAFETY_ALERTS}
              roleId={ROLE_ID_NORMAL}
              showCreatingPanel={true}
              showDeletingBtn={true}
            />
          </SectionDiv>
        }
        adminsTab={
          <SectionDiv>
            <small>
              List of users who can access this module, process alerts and
              manage users. They will <b>NOT</b> receive email notifications
            </small>
            <ModuleUserList
              moduleId={MGGS_MODULE_ID_OPEROO_SAFETY_ALERTS}
              roleId={ROLE_ID_ADMIN}
              showCreatingPanel={true}
              showDeletingBtn={true}
            />
          </SectionDiv>
        }
        extraTabs={[
          {
            key: "settings",
            title: "Settings",
            component: (
              <SectionDiv>
                <OperooSafetyAlertModuleEditPanel />
              </SectionDiv>
            )
          },
          {
            key: "Download / Logs",
            title: "Download From Opero",
            component: (
              <SectionDiv>
                <OperooDownloadPanel />
              </SectionDiv>
            )
          }
        ]}
      />
    </AdminPage>
  );
};

export default OperooSafetyAlertsAdminPage;
