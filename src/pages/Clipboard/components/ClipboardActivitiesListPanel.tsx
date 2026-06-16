import React, { useEffect, useState } from 'react';
import { Alert, Spinner, Form } from 'react-bootstrap';
import styled from 'styled-components';
import ClipboardActivityService from "../../../services/Clipboard/ClipboardActivityService";
import ClipboardDepartmentService from "../../../services/Clipboard/ClipboardDepartmentService";
import { getActivityDetailsUrl } from '../../../services/Clipboard/ClipboardUrlBuilder';
import iClipboardActivity from "../../../types/Clipboard/iClipboardActivity";
import iClipboardDepartment from "../../../types/Clipboard/iClipboardDepartment";
import Toaster, { TOAST_TYPE_ERROR } from "../../../services/Toaster";
import iPaginatedResult from "../../../types/iPaginatedResult";
import Table, { iTableColumn } from "../../../components/common/Table";

const Wrapper = styled.div``;

const ClipboardActivitiesListPanel: React.FC = () => {
  const [activities, setActivities] = useState<iPaginatedResult<iClipboardActivity> | null>(null);
  const [departments, setDepartments] = useState<iClipboardDepartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
  const pageLength = 200;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch departments and activities in parallel
        const [deptResult, activitiesResult] = await Promise.all([
          ClipboardDepartmentService.getAllRecords(),
          ClipboardActivityService.getAll({ 
            pageLength, 
            page: currentPage,
            departmentIds: selectedDepartmentId ? [selectedDepartmentId] : undefined,
          }),
        ]);

        setDepartments(deptResult);
        setActivities(activitiesResult);
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

    void fetchData();
  }, [currentPage, selectedDepartmentId]);

  const getColumns = <T extends {}>(): iTableColumn<T>[] => [
    {
      key: 'department',
      header: 'Department',
      cell: (col: iTableColumn<T>, data: iClipboardActivity) => (
        <td key={col.key}>{data.department?.name || '-'}</td>
      ),
    },
    {
      key: 'name',
      header: 'Activity',
      cell: (col: iTableColumn<T>, data: iClipboardActivity) => (
        <td key={col.key}>
          <a
            href={getActivityDetailsUrl(data.id)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#0d6efd',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => { (e.target as HTMLAnchorElement).style.color = '#0b5ed7'; }}
            onMouseLeave={(e) => { (e.target as HTMLAnchorElement).style.color = '#0d6efd'; }}
          >
            {data.name || '-'}
          </a>
        </td>
      ),
    },
    {
      key: 'smsCode',
      header: 'SIS code',
      cell: (col: iTableColumn<T>, data: iClipboardActivity) => <td key={col.key}>{data.smsCode || '-'}</td>,
    },
    {
      key: 'activityType',
      header: 'Activity Type',
      cell: (col: iTableColumn<T>, data: iClipboardActivity) => <td key={col.key}>{data.activityType || '-'}</td>,
    },
    {
      key: 'code',
      header: 'Payroll Code',
      cell: (col: iTableColumn<T>, data: iClipboardActivity) => <td key={col.key}>{data.code || '-'}</td>,
    },
    {
      key: 'archived',
      header: 'Archived',
      cell: (col: iTableColumn<T>, data: iClipboardActivity) => (
        <td key={col.key}>{data.archived ? 'Y' : ''}</td>
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
      <Form.Group className="mb-3">
        <Form.Label>Filter by Department:</Form.Label>
        <Form.Select
          value={selectedDepartmentId || ''}
          onChange={(e) => {
            setSelectedDepartmentId(e.target.value ? Number(e.target.value) : null);
            setCurrentPage(1); // Reset to first page when filter changes
          }}
        >
          <option value="">All Departments</option>
          {departments
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
        </Form.Select>
      </Form.Group>

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
