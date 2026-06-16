import React, { useEffect, useState } from 'react';
import { Alert, Spinner, Form, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import ClipboardActivityService from "../../../services/Clipboard/ClipboardActivityService";
import ClipboardDepartmentService from "../../../services/Clipboard/ClipboardDepartmentService";
import { getActivityDetailsUrl, getDepartmentDetailsUrl } from '../../../services/Clipboard/ClipboardUrlBuilder';
import iClipboardActivity from "../../../types/Clipboard/iClipboardActivity";
import iClipboardDepartment from "../../../types/Clipboard/iClipboardDepartment";
import Toaster, { TOAST_TYPE_ERROR } from "../../../services/Toaster";
import Table, { iTableColumn } from "../../../components/common/Table";

const Wrapper = styled.div``;

const FiltersContainer = styled(Row)`
  gap: 1rem;
  margin-bottom: 1.5rem;

  .filter-group {
    flex: 1;
    min-width: 200px;
  }
`;

const ClipboardActivitiesListPanel: React.FC = () => {
  const [allActivities, setAllActivities] = useState<iClipboardActivity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<iClipboardActivity[]>([]);
  const [departments, setDepartments] = useState<iClipboardDepartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
  const [selectedSISCode, setSelectedSISCode] = useState<string | null>(null);
  const [searchName, setSearchName] = useState<string>('');
  const [archivedFilter, setArchivedFilter] = useState<'non-archived' | 'archived' | 'all'>('non-archived');
  const pageLength = 200;

  // Fetch all activities once on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch departments and all activities in parallel
        const [deptResult, activitiesResult] = await Promise.all([
          ClipboardDepartmentService.getAllRecords(),
          ClipboardActivityService.getAllRecords(), // Fetch ALL activities
        ]);

        setDepartments(deptResult);
        setAllActivities(activitiesResult);
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
  }, []);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    let filtered = [...allActivities];

    // Filter by department
    if (selectedDepartmentId !== null) {
      filtered = filtered.filter(
        (activity) => activity.department?.id === selectedDepartmentId
      );
    }

    // Filter by SIS code
    if (selectedSISCode !== null) {
      filtered = filtered.filter((activity) => activity.smsCode === selectedSISCode);
    }

    // Filter by search name (case-insensitive)
    if (searchName.trim()) {
      const lowerSearchName = searchName.toLowerCase();
      filtered = filtered.filter((activity) =>
        activity.name?.toLowerCase().includes(lowerSearchName)
      );
    }

    // Filter by archived status
    if (archivedFilter === 'non-archived') {
      filtered = filtered.filter((activity) => !activity.archived);
    } else if (archivedFilter === 'archived') {
      filtered = filtered.filter((activity) => activity.archived);
    }
    // If 'all', don't filter by archived status

    // Sort by department name (asc), then by activity name (asc)
    filtered.sort((a, b) => {
      const deptComparison = (a.department?.name || '').localeCompare(b.department?.name || '');
      if (deptComparison !== 0) {
        return deptComparison;
      }
      return (a.name || '').localeCompare(b.name || '');
    });

    setFilteredActivities(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [allActivities, selectedDepartmentId, selectedSISCode, searchName, archivedFilter]);

  const getColumns = <T extends {}>(): iTableColumn<T>[] => [
    {
      key: 'department',
      header: 'Department',
      cell: (col: iTableColumn<T>, data: iClipboardActivity) => (
        <td key={col.key}>
          {data.department?.id ? (
            <a
              href={getDepartmentDetailsUrl(data.department.id)}
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
              {data.department.name || '-'}
            </a>
          ) : (
            '-'
          )}
        </td>
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
      cell: (col: iTableColumn<T>, data: iClipboardActivity) => <td key={col.key}>{data.smsCode || ''}</td>,
    },
    {
      key: 'activityType',
      header: 'Activity Type',
      cell: (col: iTableColumn<T>, data: iClipboardActivity) => <td key={col.key}>{data.activityType || ''}</td>,
    },
    {
      key: 'code',
      header: 'Payroll Code',
      cell: (col: iTableColumn<T>, data: iClipboardActivity) => <td key={col.key}>{data.code || ''}</td>,
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

  if (!allActivities || allActivities.length === 0) {
    return (
      <Wrapper className="p-3">
        <Alert variant="info">No activities available.</Alert>
      </Wrapper>
    );
  }

  // Paginate filtered results
  const totalPages = Math.ceil(filteredActivities.length / pageLength);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * pageLength,
    currentPage * pageLength
  );

  // Extract unique SIS codes and sort alphabetically
  const uniqueSISCodes = Array.from(
    new Set(allActivities.map((activity) => activity.smsCode).filter(Boolean))
  ).sort((a, b) => (a || '').localeCompare(b || ''));

  return (
    <Wrapper className="p-3">
      {/* Filters on one line */}
      <FiltersContainer>
        {/* Department Filter */}
        <Col className="filter-group">
          <Form.Group className="mb-0">
            <Form.Label>Filter by Department:</Form.Label>
            <Form.Select
              value={selectedDepartmentId || ''}
              onChange={(e) => {
                setSelectedDepartmentId(e.target.value ? Number(e.target.value) : null);
                setCurrentPage(1);
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
        </Col>

        {/* SIS Code Filter */}
        <Col className="filter-group">
          <Form.Group className="mb-0">
            <Form.Label>Filter by SIS Code:</Form.Label>
            <Form.Select
              value={selectedSISCode || ''}
              onChange={(e) => {
                setSelectedSISCode(e.target.value ? e.target.value : null);
                setCurrentPage(1);
              }}
            >
              <option value="">All SIS Codes</option>
              {uniqueSISCodes.map((sisCode) => (
                <option key={sisCode} value={sisCode}>
                  {sisCode}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        {/* Search by Activity Name */}
        <Col className="filter-group">
          <Form.Group className="mb-0">
            <Form.Label>Search Activity Name:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter activity name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </Form.Group>
        </Col>

        {/* Archived Filter */}
        <Col className="filter-group">
          <Form.Group className="mb-0">
            <Form.Label>Archived Status:</Form.Label>
            <Form.Select
              value={archivedFilter}
              onChange={(e) =>
                setArchivedFilter(e.target.value as 'non-archived' | 'archived' | 'all')
              }
            >
              <option value="non-archived">Non-Archived Only</option>
              <option value="archived">Archived Only</option>
              <option value="all">All (Include Archived)</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </FiltersContainer>

      {filteredActivities.length === 0 ? (
        <Alert variant="info">
          No activities match your filters. Try adjusting your search criteria.
        </Alert>
      ) : (
        <Table
          rows={paginatedActivities}
          columns={getColumns<iClipboardActivity>()}
          responsive
          hover
          striped
          pagination={{
            totalPages: totalPages || 1,
            currentPage,
            onSetCurrentPage: setCurrentPage,
          }}
        />
      )}
    </Wrapper>
  );
};

export default ClipboardActivitiesListPanel;
