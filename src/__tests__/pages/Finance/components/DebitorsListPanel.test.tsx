import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import DebitorsListPanel from '../../../../pages/Finance/components/DebitorsListPanel';
import SynVDebtorService from '../../../../services/Synergetic/Finance/SynVDebtorService';
import ComponentTestHelper from '../../../helper/ComponentTestHelper';
import {SynStudentProfileSelectorTestId} from '../../../../components/student/__mocks__/SynStudentProfileSelector';

jest.mock('../../../../services/Synergetic/Finance/SynVDebtorService');
jest.mock('../../../../components/student/SynStudentProfileSelector');

describe('DebitorsListPanel', () => {
  ComponentTestHelper.prepare();

  const mockedSynVDebtorService = SynVDebtorService as jest.Mocked<typeof SynVDebtorService>;
  const baseResponse = {
    currentPage: 1,
    perPage: 10,
    from: 1,
    to: 1,
    total: 1,
    pages: 2,
    data: [{
      debitorId: 1001,
      debitorName: 'Ada Parent',
      debitorHomeEmail: 'home@example.com',
      debitorOccupEmail: 'work@example.com',
      debitorHomePhone: '1234',
      debitorMobilePhone: '0400',
      debitorOccupPhone: '5678',
      debitorOccupMobilePhone: '0499',
      debitorSpouseName: 'Grace Parent',
      debitorSpouseEmail: 'spouse@example.com',
      debitorSpouseDefaultEmail: 'spouse-default@example.com',
      debitorSpouseOccupEmail: 'spouse-work@example.com',
      debitorSpouseMobilePhone: '0411',
      debitorSpouseOccupPhone: '9012',
      debitorSpouseOccupMobilePhone: '0488',
      debitorAddress: '1 Main St',
      students: [{studentId: 3001, studentName: 'Student One'}],
      currentBalance: 44.5,
      lastPaymentAmount: 20,
    }],
  };

  beforeEach(() => {
    mockedSynVDebtorService.getFinanceDebitors.mockResolvedValue(baseResponse as any);
  });

  test('loads default debtors and paginates with active criteria', async () => {
    render(<DebitorsListPanel />);

    await waitFor(() => expect(mockedSynVDebtorService.getFinanceDebitors).toHaveBeenCalledWith({
      searchText: '',
      selectedStudentId: null,
      selectedStudentDebtorId: null,
      currentPage: 1,
      perPage: 10,
    }));

    expect(await screen.findByText('Ada Parent')).toBeInTheDocument();
    expect(await screen.findByText('Student One')).toBeInTheDocument();

    fireEvent.click(screen.getByText('2'));

    await waitFor(() => expect(mockedSynVDebtorService.getFinanceDebitors).toHaveBeenLastCalledWith({
      searchText: '',
      selectedStudentId: null,
      selectedStudentDebtorId: null,
      currentPage: 2,
      perPage: 10,
    }));
  });

  test('submits search text and resets filters back to page 1', async () => {
    render(<DebitorsListPanel />);

    await waitFor(() => expect(mockedSynVDebtorService.getFinanceDebitors).toHaveBeenCalledTimes(1));

    fireEvent.change(screen.getByLabelText('Search'), {target: {value: 'grace'}});
    fireEvent.click(screen.getByRole('button', {name: 'Search'}));

    await waitFor(() => expect(mockedSynVDebtorService.getFinanceDebitors).toHaveBeenLastCalledWith({
      searchText: 'grace',
      selectedStudentId: null,
      selectedStudentDebtorId: null,
      currentPage: 1,
      perPage: 10,
    }));
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', {name: 'Reset Filters'}));

    await waitFor(() => expect(mockedSynVDebtorService.getFinanceDebitors).toHaveBeenLastCalledWith({
      searchText: '',
      selectedStudentId: null,
      selectedStudentDebtorId: null,
      currentPage: 1,
      perPage: 10,
    }));
    expect(screen.getByLabelText('Search')).toHaveValue('');
  });

  test('applies current-student debtor filtering and shows empty state when no rows return', async () => {
    mockedSynVDebtorService.getFinanceDebitors
      .mockResolvedValueOnce(baseResponse as any)
      .mockResolvedValueOnce({
        ...baseResponse,
        total: 0,
        pages: 0,
        data: [],
      } as any);

    render(<DebitorsListPanel />);

    await waitFor(() => expect(mockedSynVDebtorService.getFinanceDebitors).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByTestId(SynStudentProfileSelectorTestId).querySelector('button') as HTMLButtonElement);
    fireEvent.click(screen.getByRole('button', {name: 'Search'}));

    await waitFor(() => expect(mockedSynVDebtorService.getFinanceDebitors).toHaveBeenLastCalledWith({
      searchText: '',
      selectedStudentId: 'S101',
      selectedStudentDebtorId: 201,
      currentPage: 1,
      perPage: 10,
    }));
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    expect(screen.getByText('No debtors found for the current filters.')).toBeInTheDocument();
  });
});
