import React, { useState } from "react";
import { Tab, Tabs, Button } from "react-bootstrap";
import styled from "styled-components";
import Page from "../../layouts/Page";
import { MGGS_MODULE_ID_CLIPBOARD } from "../../types/modules/iModuleUser";
import ClipboardSessionsListPanel from "./components/ClipboardSessionsListPanel";
import ClipboardSyncConfirmPopup from "./components/ClipboardSyncConfirmPopup";
import ClipboardAdminPage from "./ClipboardAdminPage";

const TAB_SESSIONS = "SESSIONS";

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

interface ClipboardPageProps {
  // Optional props for testing or parent-level control
}

const ClipboardPage: React.FC<ClipboardPageProps> = () => {
  const [selectedTab, setSelectedTab] = useState(TAB_SESSIONS);
  const [showSyncPopup, setShowSyncPopup] = useState(false);

  if (!selectedTab) {
    setSelectedTab(TAB_SESSIONS);
  }

  return (
    <>
      <Page 
        title={
          <PageHeader>
            <h3>Clipboard Management</h3>
            <Button 
              variant="info" 
              size="sm"
              onClick={() => setShowSyncPopup(true)}
              title="Manually trigger MusicSync"
            >
              Sync Now
            </Button>
          </PageHeader>
        } 
        moduleId={MGGS_MODULE_ID_CLIPBOARD}
        AdminPage={ClipboardAdminPage}
      >
        <Tabs
          activeKey={selectedTab}
          className="mb-3"
          onSelect={(k) => setSelectedTab(k || TAB_SESSIONS)}
          unmountOnExit
        >
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
