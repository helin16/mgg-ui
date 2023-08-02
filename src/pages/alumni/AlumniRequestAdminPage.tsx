import React from "react";
import ModuleUserList from "../../components/module/ModuleUserList";
import { MGGS_MODULE_ID_ALUMNI_REQUEST } from "../../types/modules/iModuleUser";
import { ROLE_ID_ADMIN, ROLE_ID_NORMAL } from "../../types/modules/iRole";
import AlumniModuleEditPanel from "./components/AlumniModuleEditPanel";
import AdminPage from "../../layouts/AdminPage";
import AdminPageTabs from "../../layouts/AdminPageTabs";
import SectionDiv from "../../components/common/SectionDiv";

type iAlumniRequestAdminPage = {
  onNavBack: () => void;
};
const AlumniRequestAdminPage = ({ onNavBack }: iAlumniRequestAdminPage) => {
  return (
    <AdminPage
      onNavBack={onNavBack}
      moduleId={MGGS_MODULE_ID_ALUMNI_REQUEST}
      title={<h3>Alumni Request Admin</h3>}
    >
      <AdminPageTabs
        moduleId={MGGS_MODULE_ID_ALUMNI_REQUEST}
        usersTab={
          <SectionDiv>
            <small>
              A list of users who can approve the request and receive email
              notifications when a new request submitted.
            </small>
            <ModuleUserList
              moduleId={MGGS_MODULE_ID_ALUMNI_REQUEST}
              roleId={ROLE_ID_NORMAL}
              showDeletingBtn={true}
              showCreatingPanel={true}
            />
          </SectionDiv>
        }
        adminsTab={
          <SectionDiv>
            <small>
              A list of users manage this module and will NOT receive any emails
              when a new request submitted.
            </small>
            <ModuleUserList
              moduleId={MGGS_MODULE_ID_ALUMNI_REQUEST}
              roleId={ROLE_ID_ADMIN}
              showDeletingBtn={true}
              showCreatingPanel={true}
            />
          </SectionDiv>
        }
        extraTabs={[{
          key: 'settings',
          title: 'Settings',
          component: <SectionDiv><AlumniModuleEditPanel /></SectionDiv>
        }]}
      />
    </AdminPage>
  );
};

export default AlumniRequestAdminPage;
