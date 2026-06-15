import React, { useState, useEffect } from 'react';
import { Table, Badge, Spinner, Alert } from 'react-bootstrap';
import styled from 'styled-components';
import iClipboardSyncMessage from '../../types/Clipboard/iClipboardSyncMessage';
import AppService from '../../services/AppService';
import Toaster, { TOAST_TYPE_ERROR } from '../../services/Toaster';

const Wrapper = styled.div`
  .table-responsive {
    max-height: 600px;
    overflow-y: auto;
  }

  .status-badge {
    font-size: 0.85rem;
  }

  .timestamp {
    font-size: 0.9rem;
    color: #666;
  }
`;

const getStatusBadge = (status: string) => {
  const statusUpper = (status || '').toUpperCase();
  switch (statusUpper) {
    case 'SUCCESS':
      return <Badge bg="success">{status}</Badge>;
    case 'FAILED':
      return <Badge bg="danger">{status}</Badge>;
    case 'PROCESSING':
    case 'WIP':
      return <Badge bg="info">{status}</Badge>;
    case 'NEW':
      return <Badge bg="secondary">{status}</Badge>;
    default:
      return <Badge bg="secondary">{status}</Badge>;
  }
};

const ClipboardMusicSyncLogsPanel: React.FC = () => {
  const [logs, setLogs] = useState<iClipboardSyncMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AppService.get('/clipboard/syncMusic', { perPage: 100 });
      const data = response.data?.data || response.data || [];
      setLogs(Array.isArray(data) ? data : []);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to load sync logs';
      setError(errorMessage);
      Toaster.showToast(errorMessage, TOAST_TYPE_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const getMessageDisplay = (log: iClipboardSyncMessage): string => {
    if (log.error?.message) {
      return log.error.message;
    }
    if (log.response?.syncedCount !== undefined) {
      return `Synced: ${log.response.syncedCount}, Skipped: ${log.response.skippedCount || 0}`;
    }
    return log.type || '-';
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

  return (
    <Wrapper className="p-3">
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {logs.length === 0 ? (
        <Alert variant="info">No sync logs available yet.</Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Status</th>
                <th>Details</th>
                <th>Created</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>{log.type}</td>
                  <td>
                    <span className="status-badge">
                      {getStatusBadge(log.status)}
                    </span>
                  </td>
                  <td>{getMessageDisplay(log)}</td>
                  <td className="timestamp">
                    {log.createdAt ? new Date(log.createdAt).toLocaleString() : '-'}
                  </td>
                  <td className="timestamp">
                    {log.updatedAt ? new Date(log.updatedAt).toLocaleString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Wrapper>
  );
};

export default ClipboardMusicSyncLogsPanel;
