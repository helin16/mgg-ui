import React from "react";
import { MGGS_MODULE_ID_ONLINE_DONATION } from "../../types/modules/iModuleUser";
import OnlineDonationModuleSettingsPanel from "./components/OnlineDonationModuleSettingsPanel";
import AdminPageTabs from "../../layouts/AdminPageTabs";
import AdminPage from "../../layouts/AdminPage";

type iOnlineDonationAdminPage = {
  onNavBack: () => void;
};
const OnlineDonationAdminPage = ({ onNavBack }: iOnlineDonationAdminPage) => {
  return (
    <AdminPage
      onNavBack={onNavBack}
      title={<h3>Donation Manager - Admin</h3>}
      moduleId={MGGS_MODULE_ID_ONLINE_DONATION}
    >
      <AdminPageTabs
        moduleId={MGGS_MODULE_ID_ONLINE_DONATION}
        extraTabs={[
          {
            title: "Settings",
            key: "Settings",
            component: <OnlineDonationModuleSettingsPanel />
          }
        ]}
      />
    </AdminPage>
  );
};

export default OnlineDonationAdminPage;
