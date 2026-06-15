import React, { useState } from "react";
import { Table, Button, Spinner, Badge } from "react-bootstrap";
import iClipboardTeam from "../../../types/Clipboard/iClipboardTeam";
import ClipboardSessionDetailsPanel from "./ClipboardSessionDetailsPanel";
import ClipboardSyncConfirmPopup from "./ClipboardSyncConfirmPopup";
import moment from 'moment-timezone';

interface ClipboardTeamsListPanelProps {
  teams: iClipboardTeam[];
  isLoading?: boolean;
  error?: string | null;
  onSyncClick?: (teamId: string | number, teamName: string) => void;
}

interface ExpandedTeamState {
  [teamId: string | number]: boolean;
}

interface SyncingTeamState {
  [teamId: string | number]: boolean;
}

const ClipboardTeamsListPanel: React.FC<ClipboardTeamsListPanelProps> = ({
  teams,
  isLoading = false,
  error = null,
  onSyncClick,
}) => {
  const [expandedTeams, setExpandedTeams] = useState<ExpandedTeamState>({});
  const [syncingTeams, setSyncingTeams] = useState<SyncingTeamState>({});
  const [showSyncPopup, setShowSyncPopup] = useState(false);
  const [selectedTeamForSync, setSelectedTeamForSync] = useState<{
    id: string | number;
    name: string;
  } | null>(null);

  const handleTeamRowClick = (teamId: string | number) => {
    setExpandedTeams((prev) => ({
      ...prev,
      [teamId]: !prev[teamId],
    }));
  };

  const handleSyncClick = (team: iClipboardTeam) => {
    setSelectedTeamForSync({
      id: team.id,
      name: team.name || team.classCode || "Unknown Team",
    });
    setShowSyncPopup(true);
  };

  const handleSyncConfirm = async () => {
    if (!selectedTeamForSync) return;

    // Set syncing state for the button
    setSyncingTeams((prev) => ({
      ...prev,
      [selectedTeamForSync.id]: true,
    }));

    // Close popup
    setShowSyncPopup(false);

    // Call parent sync handler if provided
    if (onSyncClick) {
      try {
        await onSyncClick(selectedTeamForSync.id, selectedTeamForSync.name);
      } finally {
        // Clear syncing state after sync completes (success or error)
        setSyncingTeams((prev) => ({
          ...prev,
          [selectedTeamForSync.id]: false,
        }));
      }
    }

    setSelectedTeamForSync(null);
  };

  const handleSyncCancel = () => {
    setShowSyncPopup(false);
    setSelectedTeamForSync(null);
  };

  // Show empty state
  if (!isLoading && teams.length === 0) {
    return (
      <div className="alert alert-info mt-4" role="alert">
        <strong>No Teams Configured</strong>
        <p className="mb-0 mt-2">
          There are no clipboard teams configured yet. Check back later or contact support.
        </p>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading teams...</span>
        </Spinner>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="alert alert-danger mt-4" role="alert">
        <strong>Error Loading Teams:</strong> {error}
      </div>
    );
  }

  return (
    <>
      <div className="teams-list-container mt-3">
        <Table hover responsive className="table-sm">
          <thead className="table-light">
            <tr>
              <th style={{ width: "35%" }}>Team Name</th>
              <th style={{ width: "25%" }}>Session</th>
              <th style={{ width: "20%" }}>Last Sync</th>
              <th style={{ width: "20%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => {
              const isExpanded = expandedTeams[team.id];
              const isSyncing = syncingTeams[team.id];
              const teamName = team.name || team.classCode || "Unknown Team";

              return (
                <React.Fragment key={team.id}>
                  {/* Main team row */}
                  <tr
                    onClick={() => handleTeamRowClick(team.id)}
                    style={{ cursor: "pointer", backgroundColor: isExpanded ? "#f8f9fa" : "" }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleTeamRowClick(team.id);
                      }
                    }}
                    aria-expanded={isExpanded}
                    aria-label={`Team: ${teamName}, click to expand details`}
                  >
                    <td>
                      <span className="me-2">
                        {isExpanded ? "▼" : "▶"}
                      </span>
                      <strong>{teamName}</strong>
                      {team.classCode && team.classCode !== teamName && (
                        <div className="small text-muted">{team.classCode}</div>
                      )}
                    </td>
                    <td className="text-muted">
                      {isExpanded ? "" : "Click to view"}
                    </td>
                    <td>—</td>
                    <td>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSyncClick(team);
                        }}
                        disabled={isSyncing}
                        title="Trigger manual music sync for this team"
                      >
                        {isSyncing ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Syncing...
                          </>
                        ) : (
                          "Sync"
                        )}
                      </Button>
                    </td>
                  </tr>

                  {/* Expanded session details row */}
                  {isExpanded && (
                    <tr className="table-light">
                      <td colSpan={4} className="p-4">
                        <ClipboardSessionDetailsPanel teamId={team.id} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </Table>
      </div>

      {/* Sync confirmation popup */}
      <ClipboardSyncConfirmPopup
        show={showSyncPopup}
        teamName={selectedTeamForSync?.name || ""}
        onConfirm={handleSyncConfirm}
        onCancel={handleSyncCancel}
      />
    </>
  );
};

export default ClipboardTeamsListPanel;
