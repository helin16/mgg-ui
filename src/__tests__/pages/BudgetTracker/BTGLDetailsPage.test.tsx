import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import BTGLDetailsPage from '../../../pages/BudgetTracker/BTGLDetailsPage';
import { BTGLJournalInMonthPanelTestId } from '../../../pages/BudgetTracker/components/__mocks__/BTGLJournalInMonthPanel';
import { BTGLDetailsPanelKey, BTGLDetailsPanelTestId } from '../../../pages/BudgetTracker/components/__mocks__/BTGLDetailsPanel';
import BTLockDownService from '../../../services/BudgetTracker/BTLockDownService';
import AuthService from '../../../services/AuthService';
import Toaster from '../../../services/Toaster';
import { ROLE_ID_ADMIN, ROLE_ID_NORMAL } from '../../../types/modules/iRole';

jest.mock('../../../pages/BudgetTracker/components/BTGLDetailsPanel');
jest.mock('../../../pages/BudgetTracker/components/BTGLJournalListPanel');
jest.mock('../../../pages/BudgetTracker/components/BTGLJournalInMonthPanel');
jest.mock('../../../pages/BudgetTracker/components/BTItemCreatePopupBtn');
jest.mock('../../../pages/BudgetTracker/components/BTItemBulkCreatePopupBtn');
jest.mock('../../../components/common/LoadingBtn');
jest.mock('../../../services/BudgetTracker/BTLockDownService');
jest.mock('../../../services/Toaster');
jest.mock('../../../services/AuthService', () => ({
  __esModule: true,
  default: {
    canAccessModule: jest.fn(() => Promise.resolve({})),
  },
}));

const mockedGetAll = BTLockDownService.getAll as jest.Mock;
const mockedCanAccessModule = AuthService.canAccessModule as jest.Mock;
const mockedShowApiError = Toaster.showApiError as jest.Mock;

// Current calendar year + 1 - must match BTGLDetailsPage's budgetYear.
const BUDGET_YEAR = new Date().getFullYear() + 1;
const LOCKED = [{ year: BUDGET_YEAR, lockdown: '2020-01-01T00:00:00.000Z' }];

const renderPage = (selectedYear: number = BUDGET_YEAR) =>
  render(
    <BTGLDetailsPage
      gl={{ GLCode: '708705', GLDescription: '$20 Boss Program' } as any}
      selectedYear={selectedYear}
      onNavBack={() => null}
    />
  );

const lastPanelProps = async () => {
  await screen.findByTestId(BTGLDetailsPanelTestId);
  const calls = mockComponentTestHelper.get(BTGLDetailsPanelKey);
  return calls[calls.length - 1];
};

describe('BTGLDetailsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockComponentTestHelper.reset();
    mockedGetAll.mockResolvedValue([]);
    mockedCanAccessModule.mockResolvedValue({});
  });

  test('renders navigation and the in-month journal panel', async () => {
    renderPage();

    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(await screen.findByTestId(BTGLJournalInMonthPanelTestId)).toBeInTheDocument();
  });

  test('shows New Item / Bulk Create Items on an unlocked year once the exempt check resolves', async () => {
    renderPage();

    expect(await screen.findByText('Options')).toBeInTheDocument();
    expect(screen.getByText('New Item')).toBeInTheDocument();
    expect(screen.getByText('Bulk Create Items')).toBeInTheDocument();
  });

  test('hides the create options on a locked year for a non-exempt user', async () => {
    mockedGetAll.mockResolvedValue(LOCKED);

    renderPage();

    await waitFor(() => expect(mockedCanAccessModule).toHaveBeenCalled());
    await waitFor(() => expect(screen.queryByText('Options')).not.toBeInTheDocument());
    expect(screen.queryByText('New Item')).not.toBeInTheDocument();
  });

  test('keeps the create options on a locked year for an exempt (admin) user', async () => {
    mockedGetAll.mockResolvedValue(LOCKED);
    mockedCanAccessModule.mockResolvedValue({
      [ROLE_ID_ADMIN]: { canAccess: true },
      [ROLE_ID_NORMAL]: { canAccess: false },
    });

    renderPage();

    expect(await screen.findByText('Options')).toBeInTheDocument();
    expect(screen.getByText('New Item')).toBeInTheDocument();
    expect(screen.getByText('Bulk Create Items')).toBeInTheDocument();
  });

  describe('item list read-only clamp (feature 022)', () => {
    const asAdmin = () =>
      mockedCanAccessModule.mockResolvedValue({
        [ROLE_ID_ADMIN]: { canAccess: true },
        [ROLE_ID_NORMAL]: { canAccess: false },
      });
    const asException = () =>
      mockedCanAccessModule.mockResolvedValue({
        [ROLE_ID_ADMIN]: { canAccess: false },
        [ROLE_ID_NORMAL]: { canAccess: true },
      });

    test('unlocked year: isReadOnly=false for a non-exempt user', async () => {
      mockedGetAll.mockResolvedValue([]);
      renderPage(BUDGET_YEAR);
      expect((await lastPanelProps()).isReadOnly).toBe(false);
    });

    test('locked budget year, admin: isReadOnly=false', async () => {
      mockedGetAll.mockResolvedValue(LOCKED);
      asAdmin();
      renderPage(BUDGET_YEAR);
      expect((await lastPanelProps()).isReadOnly).toBe(false);
    });

    test('locked earlier year, admin: isReadOnly=false (no year limit for admins)', async () => {
      mockedGetAll.mockResolvedValue(LOCKED);
      asAdmin();
      renderPage(BUDGET_YEAR - 3);
      expect((await lastPanelProps()).isReadOnly).toBe(false);
    });

    test('locked budget year, exception user (not admin): isReadOnly=false', async () => {
      mockedGetAll.mockResolvedValue(LOCKED);
      asException();
      renderPage(BUDGET_YEAR);
      expect((await lastPanelProps()).isReadOnly).toBe(false);
    });

    test('locked earlier year, exception user (not admin): isReadOnly=true', async () => {
      mockedGetAll.mockResolvedValue(LOCKED);
      asException();
      renderPage(BUDGET_YEAR - 1);
      expect((await lastPanelProps()).isReadOnly).toBe(true);
    });

    test('locked budget year, non-exempt user: isReadOnly=true', async () => {
      mockedGetAll.mockResolvedValue(LOCKED);
      mockedCanAccessModule.mockResolvedValue({});
      renderPage(BUDGET_YEAR);
      expect((await lastPanelProps()).isReadOnly).toBe(true);
    });

    test('canAccessModule failure on a locked year: isReadOnly=true and the error is surfaced', async () => {
      mockedGetAll.mockResolvedValue(LOCKED);
      mockedCanAccessModule.mockRejectedValue(new Error('boom'));

      renderPage(BUDGET_YEAR);

      expect((await lastPanelProps()).isReadOnly).toBe(true);
      await waitFor(() => expect(mockedShowApiError).toHaveBeenCalled());
    });
  });
});
