import React, { useState, useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import Page from "../../layouts/Page";
import { MGGS_MODULE_ID_CLIPBOARD } from "../../types/modules/iModuleUser";
import ClipboardTeamService from "../../services/Clipboard/ClipboardTeamService";
import iClipboardTeam from "../../types/Clipboard/iClipboardTeam";
import Toaster, { TOAST_TYPE_ERROR } from "../../services/Toaster";
import PageLoadingSpinner from "../../components/common/PageLoadingSpinner";
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
  const [teams, setTeams] = useState<iClipboardTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all clipboard teams on component mount
   */
  useEffect(() => {
    const fetchTeams = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await ClipboardTeamService.getAll({ perPage: 100 });
        // Handle both paginated and direct array responses
        const teamsData = result.data || result;
        setTeams(Array.isArray(teamsData) ? teamsData : []);
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || 
                            err?.message || 
                            'Failed to load clipboard teams';
        setError(errorMessage);
        Toaster.showToast(errorMessage, TOAST_TYPE_ERROR);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (isLoading) {
    return (
      <Page 
        title={<h3>Clipboard Management</h3>} 
        moduleId={MGGS_MODULE_ID_CLIPBOARD}
        AdminPage={ClipboardAdminPage}
      >
        <PageLoadingSpinner />
      </Page>
    );
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
          {error ? (
            <div className="alert alert-danger" role="alert">
              <strong>Error:</strong> {error}
              <button 
                className="btn btn-sm btn-outline-danger ms-2"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : (
            <ClipboardTeamsListPanel 
              teams={teams}
              isLoading={isLoading}
              error={error}
            />
          )}
        </Tab>

        <Tab eventKey={TAB_SESSIONS} title="Sessions">
          <ClipboardSessionsListPanel />
        </Tab>
      </Tabs>
    </Page>
  );
};

export default ClipboardPage;
