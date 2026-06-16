import React, { useEffect, useState } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import styled from 'styled-components';
import ClipboardActivityService from "../../../services/Clipboard/ClipboardActivityService";
import iClipboardActivity from "../../../types/Clipboard/iClipboardActivity";
import Toaster, { TOAST_TYPE_ERROR } from "../../../services/Toaster";
import iPaginatedResult from "../../../types/iPaginatedResult";
import Table, { iTableColumn } from "../../../components/common/Table";

const Wrapper = styled.div``;

const ClipboardActivitiesListPanel: React.FC = () => {
  const [activities, setActivities] = useState<iPaginatedResult<iClipboardActivity> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageLength = 10;

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await ClipboardActivityService.getAll({ pageLength, page: currentPage });
        setActivities(result);
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message ||
          err?.message ||
          'Failed to load clipboard activities';
        setError(errorMessage);
        Toaster.showToast(errorMessage, TOAST_TYPE_ERROR);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchActivities();
  }, [currentPage]);

  const getColumns = <T extends {}>(): iTableColumn<T>[] => [
    {
      key: 'id',
      header: 'ID',
      cell: (col: iTableColumn<T>, data: iClipboardActivity) => <td key={col.key}>{data.id}</td>,
    },
    {
      key: 'name',
      header: 'Activity',
      cell: (col: iTableColumn<T>, data: iClipboardActivity) => <td key={col.key}>{data.name || '-'}</td>,
    },
    {
      key: 'code',
      header: 'Code',
      cell: (col: iTableColumn<T>, data: iClipboardActivity) => <td key={col.key}>{data.code || '-'}</td>,
    },
    {
      key: 'department',
      header: 'Department',
      cell: (col: iTableColumn<T>, data: iClipboardActivity) => (
        <td key={col.key}>{data.department?.name || '-'}</td>
      ),
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

  if (!activities || activities.data.length === 0) {
    return (
      <Wrapper className="p-3">
        <Alert variant="info">No activities available.</Alert>
      </Wrapper>
    );
  }

  return (
    <Wrapper className="p-3">
      <Table
        rows={activities.data}
        columns={getColumns<iClipboardActivity>()}
        responsive
        hover
        striped
        pagination={{
          totalPages: activities.pages || 1,
          currentPage,
          onSetCurrentPage: setCurrentPage,
        }}
      />
    </Wrapper>
  );
};

export default ClipboardActivitiesListPanel;
