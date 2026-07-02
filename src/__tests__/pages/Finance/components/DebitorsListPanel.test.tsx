import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import DebitorsListPanel from '../../../../pages/Finance/components/DebitorsListPanel';
import SynVDebtorService from '../../../../services/Synergetic/Finance/SynVDebtorService';
import ComponentTestHelper from '../../../helper/ComponentTestHelper';
import {
  SynStudentProfileSelectorKey,
  SynStudentProfileSelectorTestId
} from '../../../../components/student/__mocks__/SynStudentProfileSelector';

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
      DebtorID: 1001,
      DebtorNameExternal: 'Ada Parent',
      DebtorLegalFullName: '',
      DebtorHomeEmail: 'home@example.com',
      DebtorOccupEmail: 'work@example.com',
      DebtorHomePhone: '1234',
      DebtorMobilePhone: '0400',
      DebtorOccupPhone: '5678',
      DebtorOccupMobilePhone: '0499',
      DebtorSpouseNameExternal: 'Grace Parent',
      DebtorSpouseLegalFullName: '',
      DebitorSpouseEmail: 'spouse@example.com',
      DebitorSpouseOccupEmail: 'spouse-work@example.com',
      DebitorSpouseMobilePhone: '0411',
      DebitorSpouseOccupPhone: '9012',
      DebitorSpouseOccupMobilePhone: '0488',
      DebtorAddressFull: '1 Main St',
      students: [{
        StudentID: 3001,
        StudentNameInternal: 'Student One',
        StudentIsPastFlag: false,
      }],
      DebtorCurrentBalance: 44.5,
      DebtorLastPaymentAmount: 20,
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

    const selectorCalls = ComponentTestHelper.get(SynStudentProfileSelectorKey);
    expect(selectorCalls[selectorCalls.length - 1]).toEqual(expect.objectContaining({
      value: expect.objectContaining({
        StudentID: 'S101',
        DebtorID: 201,
      }),
    }));

    expect(screen.getByText('No debtors found for the current filters.')).toBeInTheDocument();
  });
});
