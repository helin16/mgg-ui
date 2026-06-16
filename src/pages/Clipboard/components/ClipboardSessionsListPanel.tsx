import React, { useState, useEffect, useCallback } from 'react';
import { Badge, Spinner, Alert, ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import styled from 'styled-components';
import * as _ from 'lodash';
import iClipboardSession from '../../../types/Clipboard/iClipboardSession';
import ClipboardSessionService, { iClipboardSessionQueryParams } from '../../../services/Clipboard/ClipboardSessionService';
import Toaster, { TOAST_TYPE_ERROR } from '../../../services/Toaster';
import iPaginatedResult from '../../../types/iPaginatedResult';
import Table, { iTableColumn } from '../../../components/common/Table';

const Wrapper = styled.div`
  .status-badge {
    font-size: 0.8rem;
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

const formatDateTime = (dateTime?: string): string => {
  if (!dateTime) return '-';
  try {
    return new Date(dateTime).toLocaleString();
  } catch {
    return '-';
  }
};

interface iClipboardSessionsListPanelProps {
  teamId?: number;
}

const ClipboardSessionsListPanel: React.FC<iClipboardSessionsListPanelProps> = ({ teamId }) => {
  const [sessions, setSessions] = useState<iPaginatedResult<iClipboardSession> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageLength = 10;

  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: iClipboardSessionQueryParams = {
        pageLength,
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
  }, [currentPage, teamId]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const getColumns = <T extends {}>(): iTableColumn<T>[] => [
    {
      key: 'id',
      header: 'ID',
      cell: (col: iTableColumn<T>, data: iClipboardSession) => {
        return <td key={col.key}>{data.id}</td>;
      },
    },
    {
      key: 'title',
      header: 'Title',
      cell: (col: iTableColumn<T>, data: iClipboardSession) => {
        return <td key={col.key}>{data.title}</td>;
      },
    },
    {
      key: 'activity',
      header: 'Activity',
      cell: (col: iTableColumn<T>, data: iClipboardSession) => {
        return <td key={col.key}>{data.activity?.name || '-'}</td>;
      },
    },
    {
      key: 'department',
      header: 'Department',
      cell: (col: iTableColumn<T>, data: iClipboardSession) => {
        return <td key={col.key}>{data.activity?.department?.name || '-'}</td>;
      },
    },
    {
      key: 'status',
      header: 'Status',
      cell: (col: iTableColumn<T>, data: iClipboardSession) => {
        return (
          <td key={col.key}>
            <span className="status-badge">
              {getStatusBadge(data.cancelled, data.scored)}
            </span>
          </td>
        );
      },
    },
    {
      key: 'startDateTime',
      header: 'Start Date',
      cell: (col: iTableColumn<T>, data: iClipboardSession) => {
        return <td key={col.key}>{formatDateTime(data.startDateTime)}</td>;
      },
    },
    {
      key: 'endDateTime',
      header: 'End Date',
      cell: (col: iTableColumn<T>, data: iClipboardSession) => {
        return <td key={col.key}>{formatDateTime(data.endDateTime)}</td>;
      },
    },
    {
      key: 'teams',
      header: 'Teams',
      cell: (col: iTableColumn<T>, data: iClipboardSession) => {
        return (
          <td key={col.key}>
            {data.teams && data.teams.length > 0
              ? data.teams.map(t => t.name).join(', ')
              : '-'}
          </td>
        );
      },
    },
  ];

  const getPaginationBtns = () => {
    const totalPages = sessions?.pages || 0;
    const windowSize = 7;
    
    if (totalPages <= windowSize) {
      return _.range(1, totalPages + 1);
    }

    const halfWindow = Math.floor(windowSize / 2);
    let start = currentPage - halfWindow;
    let end = currentPage + halfWindow;

    if (start < 1) {
      start = 1;
      end = Math.min(windowSize, totalPages);
    }

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - windowSize + 1);
    }

    return _.range(start, end + 1);
  };

  const getPagination = () => {
    const totalPages = sessions?.pages || 0;
    if (!sessions || totalPages <= 1) {
      return null;
    }

    return (
      <ButtonToolbar className="pagination-wrapper mt-3 d-flex justify-content-center gap-2">
        {currentPage <= 1 ? null : (
          <ButtonGroup>
            <Button variant="link" size="sm" onClick={() => setCurrentPage(1)}>
              {'<<'}
            </Button>
            <Button variant="link" size="sm" onClick={() => setCurrentPage(currentPage - 1)}>
              {'<'}
            </Button>
          </ButtonGroup>
        )}

        <ButtonGroup>
          {getPaginationBtns().map(index => {
            return (
              <Button
                key={index}
                variant={index === currentPage ? 'primary' : 'outline-secondary'}
                size="sm"
                onClick={() => setCurrentPage(index)}
              >
                {index}
              </Button>
            );
          })}
        </ButtonGroup>

        {currentPage >= totalPages ? null : (
          <ButtonGroup>
            <Button variant="link" size="sm" onClick={() => setCurrentPage(currentPage + 1)}>
              {'>'}
            </Button>
            <Button variant="link" size="sm" onClick={() => setCurrentPage(totalPages)}>
              {'>>'}
            </Button>
          </ButtonGroup>
        )}
      </ButtonToolbar>
    );
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
      <Table
        rows={sessions.data}
        columns={getColumns<iClipboardSession>()}
        responsive
        hover
        striped
      />
      {getPagination()}
    </Wrapper>
  );
};

export default ClipboardSessionsListPanel;
