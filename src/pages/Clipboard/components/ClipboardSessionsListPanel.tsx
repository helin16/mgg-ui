import React, { useState, useEffect } from 'react';
import { Badge, Spinner, Alert, ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import styled from 'styled-components';
import * as _ from 'lodash';
import iClipboardSession from '../../../types/Clipboard/iClipboardSession';
import ClipboardSessionService, { iClipboardSessionQueryParams } from '../../../services/Clipboard/ClipboardSessionService';
import Toaster, { TOAST_TYPE_ERROR } from '../../../services/Toaster';
import iPaginatedResult from '../../../types/iPaginatedResult';
import Table, { iTableColumn } from '../../../components/common/Table';
import MathHelper from '../../../helper/MathHelper';

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
  const perPage = 10;

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

  const getColumns = <T extends {}>() => [
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
    const windowSize = 7;
    const maxPageNo = sessions?.pages || 0;

    if (maxPageNo <= windowSize) {
      return _.range(1, maxPageNo + 1);
    }

    if (currentPage >= MathHelper.sub(maxPageNo, MathHelper.div(windowSize, 2))) {
      return _.range(
        MathHelper.sub(MathHelper.add(maxPageNo, 1), windowSize),
        MathHelper.add(maxPageNo, 1)
      );
    }

    let start = MathHelper.sub(currentPage, 2) < 1 ? 1 : MathHelper.sub(currentPage, 2);
    let end =
      MathHelper.add(start, windowSize) > maxPageNo
        ? MathHelper.add(maxPageNo, 1)
        : MathHelper.add(start, windowSize);
    return _.range(start, end);
  };

  const getPagination = () => {
    if (!sessions || sessions.pages <= 1) {
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

        {currentPage >= sessions?.pages ? null : (
          <ButtonGroup>
            <Button variant="link" size="sm" onClick={() => setCurrentPage(currentPage + 1)}>
              {'>'}
            </Button>
            <Button variant="link" size="sm" onClick={() => setCurrentPage(sessions?.pages)}>
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
