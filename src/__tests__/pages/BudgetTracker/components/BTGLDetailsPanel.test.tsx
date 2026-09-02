import React from 'react';
import { render, waitFor } from '@testing-library/react';
import mockComponentTestHelper from '../../../helper/ComponentTestHelper';
import BTGLDetailsPanel from '../../../../pages/BudgetTracker/components/BTGLDetailsPanel';
import BTItemService from '../../../../services/BudgetTracker/BTItemService';
import AuthService from '../../../../services/AuthService';

const BTItemsTableKey = 'BTItemsTable';
const BTItemsTableTestId = 'BTItemsTable';

jest.mock('react-redux', () => ({
  useSelector: (fn: any) => fn({ auth: { user: { synergyId: 1 } } }),
}));
jest.mock('../../../../services/BudgetTracker/BTItemService');
jest.mock('../../../../services/AuthService');
jest.mock('../../../../services/Synergetic/Community/SynCommunityService');
jest.mock('../../../../services/Toaster');
jest.mock('../../../../components/student/FileYearSelector', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('../../../../pages/BudgetTracker/components/BTItemExportBtn', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('../../../../pages/BudgetTracker/components/BTLockdownPanel', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('../../../../pages/BudgetTracker/components/BTItemsTable', () => ({
  __esModule: true,
  default: mockComponentTestHelper.mockComponent('BTItemsTable', 'BTItemsTable'),
}));

const mockedGetAll = BTItemService.getAll as jest.Mock;
const mockedIsModuleRole = AuthService.isModuleRole as jest.Mock;

const renderPanel = (isReadOnly: boolean) =>
  render(
    <BTGLDetailsPanel
      gl={{ GLCode: '708705', GLDescription: 'x' } as any}
      showingYear={2027}
      onChangeYear={() => null}
      isReadOnly={isReadOnly}
    />
  );

const lastTableProps = async () => {
  await waitFor(() => expect(mockComponentTestHelper.get(BTItemsTableKey).length).toBeGreaterThan(0));
  const calls = mockComponentTestHelper.get(BTItemsTableKey);
  return calls[calls.length - 1];
};

describe('BTGLDetailsPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockComponentTestHelper.reset();
    mockedGetAll.mockResolvedValue({ data: [] });
    mockedIsModuleRole.mockResolvedValue(false);
  });

  test('loads module exports', () => {
    const mod = require('../../../../pages/BudgetTracker/components/BTGLDetailsPanel');
    expect(mod.default || mod).toBeTruthy();
  });

  test('forwards isReadOnly=true to the item table', async () => {
    renderPanel(true);
    expect((await lastTableProps()).readyOnly).toBe(true);
  });

  test('forwards isReadOnly=false to the item table', async () => {
    renderPanel(false);
    expect((await lastTableProps()).readyOnly).toBe(false);
  });
});
