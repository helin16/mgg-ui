import React, { useState, useEffect } from 'react';
import { Table, Badge, Spinner, Alert, Pagination } from 'react-bootstrap';
import styled from 'styled-components';
import iClipboardSession from '../../../types/Clipboard/iClipboardSession';
import ClipboardSessionService, { iClipboardSessionQueryParams } from '../../../services/Clipboard/ClipboardSessionService';
import Toaster, { TOAST_TYPE_ERROR } from '../../../services/Toaster';
import iPaginatedResult from '../../../types/iPaginatedResult';

const Wrapper = styled.div`
  .table-wrapper {
    overflow-x: auto;
  }

  .session-table {
    font-size: 0.9rem;

    th {
      background-color: #f8f9fa;
      font-weight: 600;
    }

    td {
      vertical-align: middle;
      padding: 0.75rem;
    }

    .status-badge {
      font-size: 0.8rem;
    }

    .datetime {
      font-size: 0.85rem;
      color: #666;
    }

    .activity-name {
      font-weight: 500;
    }
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
  }
`;

const getStatusBadge = (cancelled?: boolean, scored?: boolean) => {
  if (cancelled) {
    return <Badge bg="danger">Cancelled</Badge>;
  }
  if (scored) {
    return <Badge bg="success">Scored</Badge>;
  }
  return <Badge bg="info">Pending</Badge>;
};

interface iClipboardSessionsListPanelProps {
  teamId?: number;
}

const ClipboardSessionsListPanel: React.FC<iClipboardSessionsListPanelProps> = ({ teamId }) => {
  const [sessions, setSessions] = useState<iPaginatedResult<iClipboardSession> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 20;

  useEffect(() => {
    fetchSessions();
  }, [currentPage, teamId]);

  const fetchSessions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: iClipboardSessionQueryParams = {
        perPage,
        page: currentPage,
        includeTeams: true,
        includeStaff: true,
      };

      if (teamId) {
        params.teamId = teamId;
      }

      const response = await ClipboardSessionService.getAll(params);
      setSessions(response);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to load sessions';
      setError(errorMessage);
      Toaster.showToast(errorMessage, TOAST_TYPE_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

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

  if (!sessions || sessions.data.length === 0) {
    return (
      <Wrapper className="p-3">
        <Alert variant="info">No sessions available.</Alert>
      </Wrapper>
    );
  }

  return (
    <Wrapper className="p-3">
      <div className="table-wrapper">
        <Table striped bordered hover className="session-table mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Activity</th>
              <th>Department</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Teams</th>
            </tr>
          </thead>
          <tbody>
            {sessions.data.map((session) => (
              <tr key={session.id}>
                <td>{session.id}</td>
                <td>{session.title}</td>
                <td className="activity-name">
                  {session.activity?.name || '-'}
                </td>
                <td>{session.activity?.department?.name || '-'}</td>
                <td>
                  <span className="status-badge">
                    {getStatusBadge(session.cancelled, session.scored)}
                  </span>
                </td>
                <td className="datetime">
                  {session.startDateTime ? new Date(session.startDateTime).toLocaleString() : '-'}
                </td>
                <td className="datetime">
                  {session.endDateTime ? new Date(session.endDateTime).toLocaleString() : '-'}
                </td>
                <td>
                  {session.teams && session.teams.length > 0
                    ? session.teams.map(t => t.name).join(', ')
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {sessions.pages && sessions.pages > 1 && (
        <div className="pagination-container">
          <Pagination>
            <Pagination.First
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
            />
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            />

            {Array.from({ length: Math.min(sessions.pages, 7) }, (_, i) => {
              let pageNum = 1;
              if (sessions.pages > 7) {
                if (currentPage > 3) {
                  pageNum = currentPage - 3 + i;
                } else {
                  pageNum = i + 1;
                }
              } else {
                pageNum = i + 1;
              }

              return (
                <Pagination.Item
                  key={pageNum}
                  active={pageNum === currentPage}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Pagination.Item>
              );
            })}

            <Pagination.Next
              disabled={currentPage === sessions.pages}
              onClick={() => setCurrentPage(currentPage + 1)}
            />
            <Pagination.Last
              disabled={currentPage === sessions.pages}
              onClick={() => setCurrentPage(sessions.pages)}
            />
          </Pagination>
        </div>
      )}
    </Wrapper>
  );
};

export default ClipboardSessionsListPanel;
