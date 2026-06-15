import React, { useState, useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import Page from "../../layouts/Page";
import { MGGS_MODULE_ID_CLIPBOARD } from "../../types/modules/iModuleUser";
import ClipboardTeamService from "../../services/Clipboard/ClipboardTeamService";
import iClipboardTeam from "../../types/Clipboard/iClipboardTeam";
import Toaster from "../../components/notifications/Toaster";
import PageLoadingSpinner from "../../components/PageLoadingSpinner";
import ClipboardTeamsListPanel from "./components/ClipboardTeamsListPanel";

const TAB_MUSIC_SYNC = "MUSIC_SYNC";
const TAB_LOGS = "LOGS";
const TAB_SETTINGS = "SETTINGS";

interface ClipboardMusicSyncPageProps {
  // Optional props for testing or parent-level control
}

const ClipboardMusicSyncPage: React.FC<ClipboardMusicSyncPageProps> = () => {
  const [selectedTab, setSelectedTab] = useState(TAB_MUSIC_SYNC);
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
        Toaster.error(errorMessage);
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
      >
        <PageLoadingSpinner />
      </Page>
    );
  }

  return (
    <Page 
      title={<h3>Clipboard Management</h3>} 
      moduleId={MGGS_MODULE_ID_CLIPBOARD}
    >
      <Tabs
        activeKey={selectedTab}
        className="mb-3"
        onSelect={(k) => setSelectedTab(k || TAB_MUSIC_SYNC)}
        unmountOnExit
      >
        <Tab eventKey={TAB_MUSIC_SYNC} title="Music Sync">
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

        {/* Placeholder tabs for future features */}
        <Tab eventKey={TAB_LOGS} title="Logs" disabled>
          <div className="p-3 text-muted">
            <p>Sync history and logs coming soon</p>
          </div>
        </Tab>

        <Tab eventKey={TAB_SETTINGS} title="Settings" disabled>
          <div className="p-3 text-muted">
            <p>Configuration settings coming soon</p>
          </div>
        </Tab>
      </Tabs>
    </Page>
  );
};

export default ClipboardMusicSyncPage;
