import React, { useState } from "react";
import { MGGS_MODULE_ID_FUNNEL } from "../../types/modules/iModuleUser";
import {ROLE_ID_ADMIN, ROLE_ID_NORMAL} from "../../types/modules/iRole";
import ModuleUserList from "../../components/module/ModuleUserList";
import FunnelModuleEditPanel from "./components/FunnelModuleEditPanel";
import FunnelDownloadLatestPopupBtn from "./components/FunnelDownloadLatestPopupBtn";
import MathHelper from "../../helper/MathHelper";
import MessageListPanel from "../../components/common/Message/MessageListPanel";
import { MESSAGE_TYPE_FUNNEL_DOWNLOAD_LATEST } from "../../types/Message/iMessage";
import ExplanationPanel from "../../components/ExplanationPanel";
import AdminPage from "../../layouts/AdminPage";
import AdminPageTabs from "../../layouts/AdminPageTabs";
import SectionDiv from "../../components/common/SectionDiv";

type iFunnelAdminPage = {
  onNavBack: () => void;
};
const FunnelAdminPage = ({ onNavBack }: iFunnelAdminPage) => {
  const [count, setCount] = useState(0);

  return (
    <AdminPage
      onNavBack={onNavBack}
      moduleId={MGGS_MODULE_ID_FUNNEL}
      title={<h3>Funnel Module Admin</h3>}
    >
      <AdminPageTabs
        moduleId={MGGS_MODULE_ID_FUNNEL}
        usersTab={
          <SectionDiv>
            <small>List of users who can access this module.</small>
            <ModuleUserList
              moduleId={MGGS_MODULE_ID_FUNNEL}
              roleId={ROLE_ID_NORMAL}
              showCreatingPanel={true}
              showDeletingBtn={true}
            />
          </SectionDiv>
        }
        adminsTab={
          <SectionDiv>
            <small>
              List of users who can access this module. They can create users
              and change module settings
            </small>
            <ModuleUserList
              moduleId={MGGS_MODULE_ID_FUNNEL}
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
            component: <SectionDiv><FunnelModuleEditPanel /></SectionDiv>
          },
          {
            key: "sync",
            title: "Sync / Logs",
            component: (
              <SectionDiv>
                <ExplanationPanel
                  text={
                    <span>
                      This is for
                      Funnel(https://mggs-au-vic-254.app.digistorm.com/) Data
                      Sync. Funnel Data will be sync down every hour.{" "}
                      <b>
                        THE RESULT OF THIS WILL AFFECT THE POWER BI DASHBOARD
                      </b>
                    </span>
                  }
                />
                <FunnelDownloadLatestPopupBtn
                  onSubmitted={() => setCount(MathHelper.add(count, 1))}
                />
                <MessageListPanel
                  type={MESSAGE_TYPE_FUNNEL_DOWNLOAD_LATEST}
                  reloadCount={count}
                />
              </SectionDiv>
            )
          }
        ]}
      />
    </AdminPage>
  );
};

export default FunnelAdminPage;
