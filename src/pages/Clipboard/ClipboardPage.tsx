import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import Page from "../../layouts/Page";
import { MGGS_MODULE_ID_CLIPBOARD } from "../../types/modules/iModuleUser";
import ClipboardTeamsListPanel from "./components/ClipboardTeamsListPanel";
import ClipboardSessionsListPanel from "./components/ClipboardSessionsListPanel";
import ClipboardAdminPage from "./ClipboardAdminPage";

const TAB_TEAMS = "TEAMS";
const TAB_SESSIONS = "SESSIONS";

interface ClipboardPageProps {
  // Optional props for testing or parent-level control
}

const ClipboardPage: React.FC<ClipboardPageProps> = () => {
  const [selectedTab, setSelectedTab] = useState(TAB_TEAMS);

  if (!selectedTab) {
    setSelectedTab(TAB_TEAMS);
  }

  return (
    <Page 
      title={<h3>Clipboard Management</h3>} 
      moduleId={MGGS_MODULE_ID_CLIPBOARD}
      AdminPage={ClipboardAdminPage}
    >
      <Tabs
        activeKey={selectedTab}
        className="mb-3"
        onSelect={(k) => setSelectedTab(k || TAB_TEAMS)}
        unmountOnExit
      >
        <Tab eventKey={TAB_TEAMS} title="Teams">
          <ClipboardTeamsListPanel />
        </Tab>

        <Tab eventKey={TAB_SESSIONS} title="Sessions">
          <ClipboardSessionsListPanel />
        </Tab>
      </Tabs>
    </Page>
  );
};

export default ClipboardPage;
