import { MGGS_MODULE_ID_HOUSE_AWARDS } from "../../types/modules/iModuleUser";
import React from "react";
import HouseAwardEventTable from "./components/HouseAwardEventTable";
import HouseAwardEventTypeTable from "./components/HouseAwardEventTypeTable";
import AdminPage from "../../layouts/AdminPage";
import AdminPageTabs from "../../layouts/AdminPageTabs";
import SectionDiv from "../../components/common/SectionDiv";

type iHouseAwardAdminPage = {
  onNavBack: () => void;
};

const HouseAwardAdminPage = ({ onNavBack }: iHouseAwardAdminPage) => {
  return (
    <AdminPage
      title={<h4>House Award Admin</h4>}
      onNavBack={onNavBack}
      moduleId={MGGS_MODULE_ID_HOUSE_AWARDS}
    >
      <AdminPageTabs
        moduleId={MGGS_MODULE_ID_HOUSE_AWARDS}
        extraTabs={[
          {
            key: "eventTypes",
            title: "Event Types",
            component: (
              <SectionDiv>
                <HouseAwardEventTypeTable />
              </SectionDiv>
            )
          },
          {
            key: "events",
            title: "Events",
            component: (
              <SectionDiv>
                <HouseAwardEventTable />
              </SectionDiv>
            )
          }
        ]}
      />
    </AdminPage>
  );
};

export default HouseAwardAdminPage;
