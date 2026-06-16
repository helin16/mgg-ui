import React, { useEffect, useState } from 'react';
import { Alert, Spinner, Form, Row, Col, Modal, Button, Table as BootstrapTable } from 'react-bootstrap';
import styled from 'styled-components';
import ClipboardTeamService from "../../../services/Clipboard/ClipboardTeamService";
import ClipboardDepartmentService from "../../../services/Clipboard/ClipboardDepartmentService";
import ClipboardActivityService from "../../../services/Clipboard/ClipboardActivityService";
import { getTeamUrl, getDepartmentDetailsUrl, getActivityDetailsUrl } from '../../../services/Clipboard/ClipboardUrlBuilder';
import iClipboardTeam from "../../../types/Clipboard/iClipboardTeam";
import iClipboardDepartment from "../../../types/Clipboard/iClipboardDepartment";
import iClipboardActivity from "../../../types/Clipboard/iClipboardActivity";
import Toaster, { TOAST_TYPE_ERROR } from "../../../services/Toaster";
import Table, { iTableColumn } from "../../../components/common/Table";

const Wrapper = styled.div``;

const FiltersContainer = styled(Row)`
  gap: 1rem;
  margin-bottom: 1.5rem;

  .filter-group {
    flex: 1;
    min-width: 150px;
  }
`;

interface StudentModalState {
  show: boolean;
  students: iClipboardTeam['students'] | undefined;
  teamName: string;
}

const ClipboardTeamsListPanel: React.FC = () => {
  const [allTeams, setAllTeams] = useState<iClipboardTeam[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<iClipboardTeam[]>([]);
  const [departments, setDepartments] = useState<iClipboardDepartment[]>([]);
  const [activities, setActivities] = useState<iClipboardActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);
  const [selectedSISId, setSelectedSISId] = useState<string | null>(null);
  const [hiddenFilter, setHiddenFilter] = useState<'non-hidden' | 'hidden' | 'all'>('non-hidden');
  const [studentModal, setStudentModal] = useState<StudentModalState>({
    show: false,
    students: undefined,
    teamName: '',
  });
  const pageLength = 200;

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch departments, activities, and teams in parallel
        const [deptResult, activResult, teamsResult] = await Promise.all([
          ClipboardDepartmentService.getAllRecords(),
          ClipboardActivityService.getAllRecords(),
          ClipboardTeamService.getAllRecords({ includeStudents: true, includeMembers: true }),
        ]);

        setDepartments(deptResult);
        setActivities(activResult);
        setAllTeams(teamsResult);
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

    void fetchData();
  }, []);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    let filtered = [...allTeams];

    // Filter by department
    if (selectedDepartmentId !== null) {
      filtered = filtered.filter(
        (team) => team.activity?.department?.id === selectedDepartmentId
      );
    }

    // Filter by activity
    if (selectedActivityId !== null) {
      filtered = filtered.filter(
        (team) => team.activity?.id === selectedActivityId
      );
    }

    // Filter by SIS ID
    if (selectedSISId !== null && selectedSISId.trim() !== '') {
      filtered = filtered.filter((team) => team.sisId === selectedSISId);
    }

    // Filter by hidden status
    if (hiddenFilter === 'non-hidden') {
      filtered = filtered.filter((team) => !team.hidden);
    } else if (hiddenFilter === 'hidden') {
      filtered = filtered.filter((team) => team.hidden);
    }
    // If 'all', don't filter by hidden status

    // Sort by department name (asc), then by team name (asc)
    filtered.sort((a, b) => {
      const deptComparison = (a.activity?.department?.name || '').localeCompare(b.activity?.department?.name || '');
      if (deptComparison !== 0) {
        return deptComparison;
      }
      return (a.name || '').localeCompare(b.name || '');
    });

    setFilteredTeams(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [allTeams, selectedDepartmentId, selectedActivityId, selectedSISId, hiddenFilter]);

  const handleShowStudents = (team: iClipboardTeam) => {
    setStudentModal({
      show: true,
      students: team.students,
      teamName: team.name || 'Unknown Team',
    });
  };

  const handleCloseStudentModal = () => {
    setStudentModal({
      show: false,
      students: undefined,
      teamName: '',
    });
  };

  const getColumns = <T extends {}>(): iTableColumn<T>[] => [
    {
      key: 'department',
      header: 'Department',
      cell: (col: iTableColumn<T>, data: iClipboardTeam) => (
        <td key={col.key}>
          {data.activity?.department?.id ? (
            <a
              href={getDepartmentDetailsUrl(data.activity.department.id)}
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
              {data.activity.department.name || ' '}
            </a>
          ) : (
            ' '
          )}
        </td>
      ),
    },
    {
      key: 'activity',
      header: 'Activity',
      cell: (col: iTableColumn<T>, data: iClipboardTeam) => (
        <td key={col.key}>
          {data.activity?.id ? (
            <a
              href={getActivityDetailsUrl(data.activity.id)}
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
              {data.activity.name || ' '}
            </a>
          ) : (
            ' '
          )}
        </td>
      ),
    },
    {
      key: 'name',
      header: 'Team',
      cell: (col: iTableColumn<T>, data: iClipboardTeam) => (
        <td key={col.key}>
          <a
            href={getTeamUrl(data.id)}
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
            {data.name || data.classCode || ' '}
          </a>
        </td>
      ),
    },
    {
      key: 'sisId',
      header: 'SIS ID',
      cell: (col: iTableColumn<T>, data: iClipboardTeam) => <td key={col.key}>{data.sisId || ''}</td>,
    },
    {
      key: 'category',
      header: 'Category',
      cell: (col: iTableColumn<T>, data: iClipboardTeam) => (
        <td key={col.key}>{data.category?.name || ' '}</td>
      ),
    },
    {
      key: 'subcategory',
      header: 'Subcategory',
      cell: (col: iTableColumn<T>, data: iClipboardTeam) => (
        <td key={col.key}>{data.subcategory?.name || ' '}</td>
      ),
    },
    {
      key: 'staff',
      header: 'Staff',
      cell: (col: iTableColumn<T>, data: iClipboardTeam) => (
        <td key={col.key}>
          {data.assignedStaff && data.assignedStaff.length > 0
            ? data.assignedStaff.map((staff) => `${staff.firstName} ${staff.lastName}`).join(', ')
            : ' '}
        </td>
      ),
    },
    {
      key: 'students',
      header: 'Students',
      cell: (col: iTableColumn<T>, data: iClipboardTeam) => (
        <td key={col.key}>
          {data.students && data.students.length > 0 ? (
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() => handleShowStudents(data)}
            >
              {data.students.length}
            </Button>
          ) : (
            ' '
          )}
        </td>
      ),
    },
    {
      key: 'hidden',
      header: 'Hidden',
      cell: (col: iTableColumn<T>, data: iClipboardTeam) => (
        <td key={col.key}>{data.hidden ? 'Y' : ''}</td>
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

  if (!allTeams || allTeams.length === 0) {
    return (
      <Wrapper className="p-3">
        <Alert variant="info">No teams available.</Alert>
      </Wrapper>
    );
  }

  // Get unique SIS IDs grouped by department
  const sisIdsByDepartment = new Map<number | string, { dept: string; sisIds: string[] }>();
  allTeams.forEach((team) => {
    if (team.sisId && team.activity?.department?.id && team.activity?.department?.name) {
      const deptId = team.activity.department.id;
      if (!sisIdsByDepartment.has(deptId)) {
        sisIdsByDepartment.set(deptId, { 
          dept: team.activity.department.name, 
          sisIds: [] 
        });
      }
      const entry = sisIdsByDepartment.get(deptId)!;
      if (!entry.sisIds.includes(team.sisId)) {
        entry.sisIds.push(team.sisId);
      }
    }
  });

  // Sort SIS IDs within each department
  sisIdsByDepartment.forEach((entry) => {
    entry.sisIds.sort((a, b) => a.localeCompare(b));
  });

  // Get activities grouped by department
  const activitiesByDepartment = new Map<number, { dept: string; activities: iClipboardActivity[] }>();
  (selectedDepartmentId !== null
    ? activities.filter((act) => act.department?.id === selectedDepartmentId)
    : activities
  ).forEach((act) => {
    const deptId = act.department?.id || 0;
    if (!activitiesByDepartment.has(deptId)) {
      activitiesByDepartment.set(deptId, {
        dept: act.department?.name || 'Unknown',
        activities: [],
      });
    }
    activitiesByDepartment.get(deptId)!.activities.push(act);
  });

  // Sort activities within each department
  activitiesByDepartment.forEach((entry) => {
    entry.activities.sort((a, b) => a.name.localeCompare(b.name));
  });

  // Sort department groups
  const sortedActivityDepts = Array.from(activitiesByDepartment.entries())
    .sort(([, a], [, b]) => a.dept.localeCompare(b.dept));
  
  const sortedSISIdDepts = Array.from(sisIdsByDepartment.entries())
    .sort(([, a], [, b]) => a.dept.localeCompare(b.dept));

  // Paginate filtered results
  const totalPages = Math.ceil(filteredTeams.length / pageLength);
  const paginatedTeams = filteredTeams.slice(
    (currentPage - 1) * pageLength,
    currentPage * pageLength
  );

  return (
    <>
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
                  setSelectedActivityId(null); // Reset activity filter
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

          {/* Activity Filter */}
          <Col className="filter-group">
            <Form.Group className="mb-0">
              <Form.Label>Filter by Activity:</Form.Label>
              <Form.Select
                value={selectedActivityId || ''}
                onChange={(e) => {
                  setSelectedActivityId(e.target.value ? Number(e.target.value) : null);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Activities</option>
                {sortedActivityDepts.map(([_, { dept, activities: acts }]) => (
                  <optgroup key={dept} label={dept}>
                    {acts.map((act) => (
                      <option key={act.id} value={act.id}>
                        {act.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* SIS ID Filter */}
          <Col className="filter-group">
            <Form.Group className="mb-0">
              <Form.Label>Filter by SIS ID:</Form.Label>
              <Form.Select
                value={selectedSISId || ''}
                onChange={(e) => {
                  setSelectedSISId(e.target.value ? e.target.value : null);
                  setCurrentPage(1);
                }}
              >
                <option value="">All SIS IDs</option>
                {sortedSISIdDepts.map(([_, { dept, sisIds }]) => (
                  <optgroup key={dept} label={dept}>
                    {sisIds.map((sisId) => (
                      <option key={sisId} value={sisId}>
                        {sisId}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Hidden Filter */}
          <Col className="filter-group">
            <Form.Group className="mb-0">
              <Form.Label>Hidden Status:</Form.Label>
              <Form.Select
                value={hiddenFilter}
                onChange={(e) =>
                  setHiddenFilter(e.target.value as 'non-hidden' | 'hidden' | 'all')
                }
              >
                <option value="non-hidden">Non-Hidden Only</option>
                <option value="hidden">Hidden Only</option>
                <option value="all">All (Include Hidden)</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </FiltersContainer>

        {filteredTeams.length === 0 ? (
          <Alert variant="info">
            No teams match your filters. Try adjusting your search criteria.
          </Alert>
        ) : (
          <Table
            rows={paginatedTeams}
            columns={getColumns<iClipboardTeam>()}
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

      {/* Students Modal */}
      <Modal show={studentModal.show} onHide={handleCloseStudentModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Students in {studentModal.teamName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {studentModal.students && studentModal.students.length > 0 ? (
            <BootstrapTable striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>SMS ID</th>
                  <th>Year Group</th>
                  <th>Captain</th>
                </tr>
              </thead>
              <tbody>
                {studentModal.students.map((student, idx) => (
                  <tr key={idx}>
                    <td>{`${student.firstName || ''} ${student.lastName || ''}`.trim()}</td>
                    <td>{student.smsId || ' '}</td>
                    <td>{student.yearGroup?.name || ' '}</td>
                    <td>{student.captain ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </BootstrapTable>
          ) : (
            <p>No students in this team.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseStudentModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ClipboardTeamsListPanel;
