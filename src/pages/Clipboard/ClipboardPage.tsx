import React, { useState } from "react";
import { Tab, Tabs, Button } from "react-bootstrap";
import Page from "../../layouts/Page";
import { MGGS_MODULE_ID_CLIPBOARD } from "../../types/modules/iModuleUser";
import ClipboardDepartmentsListPanel from "./components/ClipboardDepartmentsListPanel";
import ClipboardActivitiesListPanel from "./components/ClipboardActivitiesListPanel";
import ClipboardTeamsListPanel from "./components/ClipboardTeamsListPanel";
import ClipboardSessionsListPanel from "./components/ClipboardSessionsListPanel";
import ClipboardSyncConfirmPopup from "./components/ClipboardSyncConfirmPopup";
import ClipboardAdminPage from "./ClipboardAdminPage";

const TAB_DEPARTMENTS = "DEPARTMENTS";
const TAB_ACTIVITIES = "ACTIVITIES";
const TAB_TEAMS = "TEAMS";
const TAB_SESSIONS = "SESSIONS";

interface ClipboardPageProps {
  // Optional props for testing or parent-level control
}

const ClipboardPage: React.FC<ClipboardPageProps> = () => {
  const [selectedTab, setSelectedTab] = useState(TAB_DEPARTMENTS);
  const [showSyncPopup, setShowSyncPopup] = useState(false);

  if (!selectedTab) {
    setSelectedTab(TAB_DEPARTMENTS);
  }

  return (
    <>
      <Page 
        title={<h3>Clipboard Management</h3>}
        moduleId={MGGS_MODULE_ID_CLIPBOARD}
        AdminPage={ClipboardAdminPage}
        extraBtns={
          <Button 
            variant="info" 
            size="sm"
            onClick={() => setShowSyncPopup(true)}
            title="Manually trigger MusicSync"
            className="me-2"
          >
            Sync Music Class
          </Button>
        }
      >
        <Tabs
          activeKey={selectedTab}
          className="mb-3"
          onSelect={(k) => setSelectedTab(k || TAB_DEPARTMENTS)}
          unmountOnExit
        >
          <Tab eventKey={TAB_DEPARTMENTS} title="Departments">
            <ClipboardDepartmentsListPanel />
          </Tab>
          <Tab eventKey={TAB_ACTIVITIES} title="Activities">
            <ClipboardActivitiesListPanel />
          </Tab>
          <Tab eventKey={TAB_TEAMS} title="Teams">
            <ClipboardTeamsListPanel />
          </Tab>
          <Tab eventKey={TAB_SESSIONS} title="Sessions">
            <ClipboardSessionsListPanel />
          </Tab>
        </Tabs>
      </Page>

      <ClipboardSyncConfirmPopup
        show={showSyncPopup}
        teamName="All Teams"
        onConfirm={() => setShowSyncPopup(false)}
        onCancel={() => setShowSyncPopup(false)}
      />
    </>
  );
};

export default ClipboardPage;
