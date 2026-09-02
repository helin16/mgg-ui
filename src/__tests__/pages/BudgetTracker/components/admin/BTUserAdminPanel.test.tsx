import React from 'react';
import {render, screen} from '@testing-library/react';
import mockComponentTestHelper from '../../../../helper/ComponentTestHelper';
import BTUserAdminPanel from '../../../../../pages/BudgetTracker/components/admin/BTUserAdminPanel';
import {ROLE_ID_ADMIN} from '../../../../../types/modules/iRole';
import {MGGS_MODULE_ID_BUDGET_TRACKER} from '../../../../../types/modules/iModuleUser';

const ModuleUserListKey = 'ModuleUserList';
const ModuleUserListTestId = 'ModuleUserList';
const BTExceptionUserListTestId = 'BTExceptionUserList';

jest.mock('../../../../../components/module/ModuleUserList', () => ({
  __esModule: true,
  default: mockComponentTestHelper.mockComponent(ModuleUserListKey, ModuleUserListTestId),
}));

jest.mock('../../../../../pages/BudgetTracker/components/admin/BTExceptionUserList', () => ({
  __esModule: true,
  default: () => <div data-testid={BTExceptionUserListTestId} />,
}));

describe('BTUserAdminPanel', () => {
  mockComponentTestHelper.prepare();

  test('loads module exports', () => {
    const mod = require('../../../../../pages/BudgetTracker/components/admin/BTUserAdminPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });

  test('renders an Admin Users list and an Exception Users list', () => {
    render(<BTUserAdminPanel />);

    expect(screen.getByText('Admin Users:')).toBeInTheDocument();
    expect(screen.getByText('Exception Users:')).toBeInTheDocument();

    expect(screen.getByTestId(ModuleUserListTestId)).toBeInTheDocument();
    expect(screen.getByTestId(BTExceptionUserListTestId)).toBeInTheDocument();

    expect(mockComponentTestHelper.get(ModuleUserListKey)).toEqual([
      expect.objectContaining({
        moduleId: MGGS_MODULE_ID_BUDGET_TRACKER,
        roleId: ROLE_ID_ADMIN,
        showCreatingPanel: true,
        showDeletingBtn: true,
      }),
    ]);
  });
});
