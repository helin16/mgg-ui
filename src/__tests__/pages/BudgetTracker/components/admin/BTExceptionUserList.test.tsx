import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import mockComponentTestHelper from '../../../../helper/ComponentTestHelper';
import BTExceptionUserList from '../../../../../pages/BudgetTracker/components/admin/BTExceptionUserList';
import UserService from '../../../../../services/UserService';
// Resolves to the manual mock (jest.mock below), which exports DateTimePickerKey.
import {DateTimePickerKey} from '../../../../../components/common/DateTimePicker';
import {MGGS_MODULE_ID_BUDGET_TRACKER} from '../../../../../types/modules/iModuleUser';
import {ROLE_ID_NORMAL} from '../../../../../types/modules/iRole';

jest.mock('react-redux', () => ({
  useSelector: (fn: any) => fn({auth: {user: {synergyId: 999}}}),
}));
jest.mock('../../../../../services/UserService');
jest.mock('../../../../../services/Toaster');
// Table is left un-mocked so the "+" header button (opens the add panel) renders.
jest.mock('../../../../../components/common/PopupModal');
jest.mock('../../../../../components/common/PageLoadingSpinner');
jest.mock('../../../../../components/common/DateTimePicker');
jest.mock('../../../../../components/common/DeleteConfirm/DeleteConfirmPopupBtn');
jest.mock('../../../../../components/form/FormLabel');
jest.mock('../../../../../components/staff/StaffSelector', () => ({
  __esModule: true,
  default: (props: any) => (
    <button type="button" onClick={() => props.onSelect({value: 123, label: 'Someone'})}>
      pick-staff
    </button>
  ),
}));

const mockedUserService = UserService as jest.Mocked<typeof UserService>;

const rows = [
  {
    SynergeticID: 111,
    ModuleID: MGGS_MODULE_ID_BUDGET_TRACKER,
    RoleID: ROLE_ID_NORMAL,
    SynCommunity: {Given1: 'Ada', Surname: 'Lovelace', OccupEmail: 'ada@example.com'},
    settings: {expiryDate: '2099-06-30'},
  },
  {
    SynergeticID: 222,
    ModuleID: MGGS_MODULE_ID_BUDGET_TRACKER,
    RoleID: ROLE_ID_NORMAL,
    SynCommunity: {Given1: 'Grace', Surname: 'Hopper', OccupEmail: 'grace@example.com'},
    settings: null,
  },
];

describe('BTExceptionUserList', () => {
  mockComponentTestHelper.prepare();

  beforeEach(() => {
    mockedUserService.getUsers.mockResolvedValue(rows as any);
    mockedUserService.createUser.mockResolvedValue({
      SynergeticID: 123,
      ModuleID: MGGS_MODULE_ID_BUDGET_TRACKER,
      RoleID: ROLE_ID_NORMAL,
      SynCommunity: {Given1: 'New', Surname: 'Person'},
      settings: {expiryDate: '2026-03-04'},
    } as any);
  });

  test('shows the stored expiry date and a "no expiry" affordance for a legacy row', async () => {
    render(<BTExceptionUserList />);

    expect(await screen.findByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByText('Grace Hopper')).toBeInTheDocument();
    expect(screen.getByText(/No expiry - set a date/i)).toBeInTheDocument();
  });

  test('add is blocked without an expiry date and calls createUser with the chosen YYYY-MM-DD once set', async () => {
    render(<BTExceptionUserList />);
    await screen.findByText('Ada Lovelace');

    fireEvent.click(screen.getByRole('button', {name: /add an exception user/i}));

    const addBtn = await screen.findByRole('button', {name: 'Add'});
    expect(addBtn).toBeDisabled();

    fireEvent.click(screen.getByText('pick-staff'));
    // still disabled until a date is chosen
    expect(screen.getByRole('button', {name: 'Add'})).toBeDisabled();

    // the last DateTimePicker on screen is the one in the add panel
    const pickButtons = screen.getAllByText('Pick Date Time');
    fireEvent.click(pickButtons[pickButtons.length - 1]);

    const enabledAddBtn = screen.getByRole('button', {name: 'Add'});
    expect(enabledAddBtn).not.toBeDisabled();
    fireEvent.click(enabledAddBtn);

    await waitFor(() =>
      expect(mockedUserService.createUser).toHaveBeenCalledWith(
        MGGS_MODULE_ID_BUDGET_TRACKER,
        ROLE_ID_NORMAL,
        123,
        {settings: {expiryDate: '2026-03-04'}}
      )
    );
  });

  test('never offers a clear-date control (DateTimePicker is used without allowClear)', async () => {
    render(<BTExceptionUserList />);
    await screen.findByText('Ada Lovelace');

    const calls = mockComponentTestHelper.get(DateTimePickerKey);
    expect(calls.length).toBeGreaterThan(0);
    calls.forEach((props: any) => expect(props.allowClear).toBeFalsy());
  });
});
