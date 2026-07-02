import {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, Button, Col, Form, Row, Table as BootstrapTable} from 'react-bootstrap';
import Table, {iTableColumn} from '../../../components/common/Table';
import SynVDebtorService from '../../../services/Synergetic/Finance/SynVDebtorService';
import iFinanceDebitorSearchCriteria from '../../../types/Synergetic/Finance/iFinanceDebitorSearchCriteria';
import iFinanceDebitorLinkedStudent from '../../../types/Synergetic/Finance/iFinanceDebitorLinkedStudent';
import SynStudentProfileSelector from '../../../components/student/SynStudentProfileSelector';
import {iVPastAndCurrentStudent} from '../../../types/Synergetic/Student/iVStudent';
import iFinanceDebitorListRow from "../../../types/Synergetic/Finance/iFinanceDebitorListRow";
import UtilsService from "../../../services/UtilsService";

const DEFAULT_PER_PAGE = 10;

type iLoadingMode = 'initial' | 'search' | 'reset' | 'page' | null;

const getInitialCriteria = (perPage = DEFAULT_PER_PAGE): iFinanceDebitorSearchCriteria => ({
  searchText: '',
  selectedStudentId: null,
  selectedStudentDebtorId: null,
  currentPage: 1,
  perPage,
});

const getInfoValue = (label: string, value: string | number) => {
  if (`${value || ''}`.trim() === '') {
    return null;
  }

  return (
    <div key={label}>
      <b>{label}:</b> {value}
    </div>
  );
};

const getDebitorDisplayName = (row: iFinanceDebitorListRow) => {
  return row.DebtorLegalFullName || row.DebtorNameExternal || row.DebtorNameInternal;
};

const getDebitorSpouseDisplayName = (row: iFinanceDebitorListRow) => {
  return row.DebtorSpouseLegalFullName || row.DebtorSpouseNameExternal || row.DebtorSpouseNameInternal;
};

const DebitorsListPanel = () => {
  const [draftCriteria, setDraftCriteria] = useState<iFinanceDebitorSearchCriteria>(getInitialCriteria());
  const [activeCriteria, setActiveCriteria] = useState<iFinanceDebitorSearchCriteria>(getInitialCriteria());
  const [selectedStudent, setSelectedStudent] = useState<iVPastAndCurrentStudent | null>(null);
  const [rows, setRows] = useState<iFinanceDebitorListRow[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingMode, setLoadingMode] = useState<iLoadingMode>('initial');

  const isLoading = loadingMode !== null;

  const loadData = useCallback(async (
    criteria: iFinanceDebitorSearchCriteria,
    mode: Exclude<iLoadingMode, null>
  ) => {
    setLoadingMode(mode);
    setErrorMessage('');

    try {
      const resp = await SynVDebtorService.getFinanceDebitors(criteria);
      setRows(resp.data || []);
      setTotalPages(resp.pages || 0);
      setActiveCriteria(criteria);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Unable to load debtors.');
      setRows([]);
      setTotalPages(0);
    } finally {
      setLoadingMode(null);
    }
  }, []);

  useEffect(() => {
    loadData(getInitialCriteria(), 'initial');
  }, [loadData]);

  const columns = useMemo((): iTableColumn<iFinanceDebitorListRow>[] => [
    {
      key: 'debitorInformation',
      header: 'Debtor Information',
      cell: (column, row: iFinanceDebitorListRow) => (
        <td key={column.key}>
          {[
            getInfoValue('ID', row.DebtorID),
            getInfoValue('Name', getDebitorDisplayName(row)),
            getInfoValue('Home Email', row.DebtorHomeEmail),
            getInfoValue('Home Phone', row.DebtorHomePhone),
            getInfoValue('Mobile Phone', row.DebtorMobilePhone),
            getInfoValue('Occup Email', row.DebtorOccupEmail),
            getInfoValue('Occup Phone', row.DebtorOccupPhone),
            getInfoValue('Occup Mobile Phone', row.DebtorOccupMobilePhone),
          ]}
        </td>
      ),
    },
    {
      key: 'debitorSpouseInformation',
      header: 'Debtor Spouse Information',
      cell: (column, row: iFinanceDebitorListRow) => (
        <td key={column.key}>
          {[
            getInfoValue('Name', getDebitorSpouseDisplayName(row)),
            getInfoValue('Email', row.DebitorSpouseEmail),
            getInfoValue('Mobile Phone', row.DebitorSpouseMobilePhone),
            getInfoValue('Occup Email', row.DebitorSpouseOccupEmail),
            getInfoValue('Occup Phone', row.DebitorSpouseOccupPhone),
            getInfoValue('Occup Mobile Phone', row.DebitorSpouseOccupMobilePhone),
          ]}
        </td>
      ),
    },
    {
      key: 'debitorAddress',
      header: 'Debtor Address',
      cell: (column, row: iFinanceDebitorListRow) => <td key={column.key}>{row.DebtorAddressFull}</td>,
    },
    {
      key: 'students',
      header: 'Students',
      cell: (column, row) => (
        <td key={column.key}>
          <BootstrapTable size={'sm'} borderless>
            <tbody>
              {row.students.map((student: iFinanceDebitorLinkedStudent) => (
                <tr key={student.StudentID}>
                  <td className={student.StudentIsPastFlag ? 'text-bg-danger text-white' : ''}>{student.StudentID}</td>
                  <td className={student.StudentIsPastFlag ? 'text-bg-danger text-white' : ''}>{student.StudentNameInternal}</td>
                  <td className={student.StudentIsPastFlag ? 'text-bg-danger text-white' : ''}>{student.StudentIsPastFlag ? 'PAST' : ''}</td>
                </tr>
              ))}
            </tbody>
          </BootstrapTable>
        </td>
      ),
    },
    {
      key: 'currentBalance',
      header: 'Current Balance',
      cell: (column, row: iFinanceDebitorListRow) => <td key={column.key}>{UtilsService.formatIntoCurrency(row.DebtorCurrentBalance)}</td>,
    },
    {
      key: 'lastPaymentAmount',
      header: 'Last Payment Amt',
      cell: (column, row: iFinanceDebitorListRow) => <td key={column.key}>{UtilsService.formatIntoCurrency(row.DebtorLastPaymentAmount)}</td>,
    },
  ], []);

  const handleSearch = () => {
    const criteria = {
      ...draftCriteria,
      currentPage: 1,
      perPage: activeCriteria.perPage || DEFAULT_PER_PAGE,
    };
    loadData(criteria, 'search');
  };

  const handleReset = () => {
    const criteria = getInitialCriteria(activeCriteria.perPage || DEFAULT_PER_PAGE);
    setSelectedStudent(null);
    setDraftCriteria(criteria);
    loadData(criteria, 'reset');
  };

  const handleStudentChanged = (student: iVPastAndCurrentStudent[] | iVPastAndCurrentStudent | null) => {
    const selectedStudent = Array.isArray(student) ? student[0] || null : student;
    setSelectedStudent(selectedStudent);
    setDraftCriteria(previous => ({
      ...previous,
      selectedStudentId: selectedStudent?.StudentID || null,
      selectedStudentDebtorId: selectedStudent?.DebtorID || null,
    }));
  };

  return (
    <>
      <Row className={'g-3 align-items-end mb-3'}>
        <Col md={5}>
          <Form.Group controlId={'finance-debitors-search'}>
            <Form.Label>Search</Form.Label>
            <Form.Control
              value={draftCriteria.searchText}
              onChange={event => setDraftCriteria({
                ...draftCriteria,
                searchText: event.target.value,
              })}
              placeholder={'Surname, given name, preferred, email, phone or mobile'}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId={'finance-debitors-student'}>
            <Form.Label>Current / Past Student</Form.Label>
            <SynStudentProfileSelector
              className={'finance-debitors-student-selector'}
              isClearable
              value={selectedStudent}
              onChange={handleStudentChanged as any}
            />
          </Form.Group>
        </Col>
        <Col md={'auto'}>
          <Button
            variant={'primary'}
            onClick={handleSearch}
            disabled={isLoading}
          >
            Search
          </Button>
        </Col>
        <Col md={'auto'}>
          <Button
            variant={'outline-secondary'}
            onClick={handleReset}
            disabled={isLoading}
          >
            Reset Filters
          </Button>
        </Col>
      </Row>

      {errorMessage !== '' ? (
        <Alert variant={'danger'}>{errorMessage}</Alert>
      ) : null}

      {!isLoading && errorMessage === '' && rows.length <= 0 ? (
        <Alert variant={'secondary'}>
          No debtors found for the current filters.
        </Alert>
      ) : null}

      <Table
        columns={columns}
        rows={rows}
        hover
        striped
        responsive
        isLoading={isLoading}
        pagination={{
          totalPages,
          currentPage: activeCriteria.currentPage,
          perPage: activeCriteria.perPage,
          onSetCurrentPage: currentPage => {
            loadData({
              ...activeCriteria,
              currentPage,
            }, 'page');
          },
        }}
      />
    </>
  );
};

export default DebitorsListPanel;
