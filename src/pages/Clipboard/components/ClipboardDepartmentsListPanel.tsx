import React, { useEffect, useState } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import styled from 'styled-components';
import ClipboardDepartmentService from "../../../services/Clipboard/ClipboardDepartmentService";
import ClipboardActivityService from "../../../services/Clipboard/ClipboardActivityService";
import { getDepartmentDetailsUrl } from "../../../services/Clipboard/ClipboardUrlBuilder";
import iClipboardDepartment from "../../../types/Clipboard/iClipboardDepartment";
import Toaster, { TOAST_TYPE_ERROR } from "../../../services/Toaster";
import Table, { iTableColumn } from "../../../components/common/Table";

const Wrapper = styled.div`
  a {
    color: #0d6efd;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
      color: #0b5ed7;
    }
  }
`;

const ClipboardDepartmentsListPanel: React.FC = () => {
  const [departments, setDepartments] = useState<iClipboardDepartment[]>([]);
  const [activityCountByDepartment, setActivityCountByDepartment] = useState<Map<number, number>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch both departments and activities in parallel
        const [allDepartments, allActivities] = await Promise.all([
          ClipboardDepartmentService.getAllRecords(),
          ClipboardActivityService.getAllRecords(),
        ]);
        
        // Build a map of departmentId -> count of activities (excluding archived)
        const countMap = new Map<number, number>();
        (allActivities || []).forEach((activity) => {
          if (activity.department?.id && !activity.archived) {
            const currentCount = countMap.get(activity.department.id) || 0;
            countMap.set(activity.department.id, currentCount + 1);
          }
        });
        setActivityCountByDepartment(countMap);
        
        // Sort departments by name in ascending order
        const sortedDepartments = (allDepartments || []).sort((a, b) => {
          const nameA = (a.name || '').toLowerCase();
          const nameB = (b.name || '').toLowerCase();
          return nameA.localeCompare(nameB);
        });
        
        setDepartments(sortedDepartments);
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message ||
          err?.message ||
          'Failed to load clipboard departments';
        setError(errorMessage);
        Toaster.showToast(errorMessage, TOAST_TYPE_ERROR);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchDepartments();
  }, []);

  const getColumns = <T extends {}>(): iTableColumn<T>[] => [
    {
      key: 'id',
      header: 'ID',
      cell: (col: iTableColumn<T>, data: iClipboardDepartment) => <td key={col.key}>{data.id}</td>,
    },
    {
      key: 'name',
      header: 'Department Name',
      cell: (col: iTableColumn<T>, data: iClipboardDepartment) => (
        <td key={col.key}>
          {data.name ? (
            <a href={getDepartmentDetailsUrl(data.id)} target="_blank" rel="noopener noreferrer">
              {data.name}
            </a>
          ) : (
            '-'
          )}
        </td>
      ),
    },
    {
      key: 'activityCount',
      header: 'No of Activities',
      cell: (col: iTableColumn<T>, data: iClipboardDepartment) => (
        <td key={col.key}>{activityCountByDepartment.get(data.id) || 0}</td>
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

  if (!departments || departments.length === 0) {
    return (
      <Wrapper className="p-3">
        <Alert variant="info">No departments available.</Alert>
      </Wrapper>
    );
  }

  return (
    <Wrapper className="p-3">
      <Table
        rows={departments}
        columns={getColumns<iClipboardDepartment>()}
        responsive
        hover
        striped
      />
    </Wrapper>
  );
};

export default ClipboardDepartmentsListPanel;
