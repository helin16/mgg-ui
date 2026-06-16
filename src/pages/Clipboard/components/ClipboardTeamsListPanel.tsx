import React, { useEffect, useState } from "react";
import { Alert, Button, Spinner } from "react-bootstrap";
import styled from 'styled-components';
import iClipboardTeam from "../../../types/Clipboard/iClipboardTeam";
import ClipboardTeamService from "../../../services/Clipboard/ClipboardTeamService";
import ClipboardSessionDetailsPanel from "./ClipboardSessionDetailsPanel";
import ClipboardSyncConfirmPopup from "./ClipboardSyncConfirmPopup";
import Toaster, { TOAST_TYPE_ERROR } from "../../../services/Toaster";
import iPaginatedResult from "../../../types/iPaginatedResult";
import Table, { iTableColumn } from "../../../components/common/Table";

const Wrapper = styled.div``;

const ClipboardTeamsListPanel: React.FC = () => {
  const [teams, setTeams] = useState<iPaginatedResult<iClipboardTeam> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [syncingTeams, setSyncingTeams] = useState<Record<string | number, boolean>>({});
  const [showSyncPopup, setShowSyncPopup] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | number | null>(null);
  const [selectedTeamForSync, setSelectedTeamForSync] = useState<{
    id: string | number;
    name: string;
  } | null>(null);
  const pageLength = 10;

  useEffect(() => {
    const fetchTeams = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await ClipboardTeamService.getAll({ pageLength, page: currentPage });
        setTeams(result);
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

    void fetchTeams();
  }, [currentPage]);

  const handleSyncClick = (team: iClipboardTeam) => {
    setSelectedTeamForSync({
      id: team.id,
      name: team.name || team.classCode || "Unknown Team",
    });
    setShowSyncPopup(true);
  };

  const handleSyncConfirm = async () => {
    if (!selectedTeamForSync) return;

    setSyncingTeams((prev) => ({
      ...prev,
      [selectedTeamForSync.id]: true,
    }));

    setShowSyncPopup(false);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setSyncingTeams((prev) => ({
        ...prev,
        [selectedTeamForSync.id]: false,
      }));
    }

    setSelectedTeamForSync(null);
  };

  const handleSyncCancel = () => {
    setShowSyncPopup(false);
    setSelectedTeamForSync(null);
  };

  const getColumns = <T extends {}>(): iTableColumn<T>[] => [
    {
      key: 'id',
      header: 'ID',
      cell: (col: iTableColumn<T>, data: iClipboardTeam) => <td key={col.key}>{data.id}</td>,
    },
    {
      key: 'name',
      header: 'Team Name',
      cell: (col: iTableColumn<T>, data: iClipboardTeam) => (
        <td key={col.key}>
          <strong>{data.name || data.classCode || 'Unknown Team'}</strong>
        </td>
      ),
    },
    {
      key: 'classCode',
      header: 'Class Code',
      cell: (col: iTableColumn<T>, data: iClipboardTeam) => <td key={col.key}>{data.classCode || '-'}</td>,
    },
    {
      key: 'activity',
      header: 'Activity',
      cell: (col: iTableColumn<T>, data: iClipboardTeam) => <td key={col.key}>{data.activity?.name || '-'}</td>,
    },
    {
      key: 'department',
      header: 'Department',
      cell: (col: iTableColumn<T>, data: iClipboardTeam) => (
        <td key={col.key}>{data.activity?.department?.name || '-'}</td>
      ),
    },
    {
      key: 'view',
      header: 'Session',
      cell: (col: iTableColumn<T>, data: iClipboardTeam) => (
        <td key={col.key}>
          <Button
            size="sm"
            variant={selectedTeamId === data.id ? 'secondary' : 'outline-secondary'}
            onClick={() => setSelectedTeamId(selectedTeamId === data.id ? null : data.id)}
          >
            {selectedTeamId === data.id ? 'Hide' : 'View'}
          </Button>
        </td>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (col: iTableColumn<T>, data: iClipboardTeam) => {
        const isSyncing = syncingTeams[data.id];
        return (
          <td key={col.key}>
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleSyncClick(data)}
              disabled={isSyncing}
              title="Trigger manual music sync for this team"
            >
              {isSyncing ? 'Syncing...' : 'Sync'}
            </Button>
          </td>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <Wrapper className="p-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Wrapper>
    );
  }

  if (error) {
    return (
      <Wrapper className="p-3">
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      </Wrapper>
    );
  }

  if (!teams || teams.data.length === 0) {
    return (
      <Wrapper className="p-3">
        <Alert variant="info">No teams available.</Alert>
      </Wrapper>
    );
  }

  return (
    <>
      <Wrapper className="p-3">
        <Table
          rows={teams.data}
          columns={getColumns<iClipboardTeam>()}
          responsive
          hover
          striped
          pagination={{
            totalPages: teams.pages || 1,
            currentPage,
            onSetCurrentPage: setCurrentPage,
          }}
        />

        {selectedTeamId ? (
          <div className="mt-4">
            <ClipboardSessionDetailsPanel teamId={Number(selectedTeamId)} />
          </div>
        ) : null}
      </Wrapper>

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
