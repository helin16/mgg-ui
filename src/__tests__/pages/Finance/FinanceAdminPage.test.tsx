import React from 'react';
import {render, screen} from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import FinanceAdminPage from '../../../pages/Finance/FinanceAdminPage';
import {MGGS_MODULE_ID_FINANCE} from '../../../types/modules/iModuleUser';
import {
  AdminPageKey,
  AdminPageTestId,
} from '../../../layouts/__mocks__/AdminPage';
import {
  AdminPageTabsKey,
  AdminPageTabsTestId,
} from '../../../layouts/__mocks__/AdminPageTabs';

jest.mock('../../../layouts/AdminPage');
jest.mock('../../../layouts/AdminPageTabs');

describe('FinanceAdminPage', () => {
  mockComponentTestHelper.prepare();

  test('renders the finance admin shell with extra settings tab', () => {
    const onNavBack = jest.fn();

    render(<FinanceAdminPage onNavBack={onNavBack} />);

    expect(screen.getByTestId(AdminPageTestId)).toBeInTheDocument();
    expect(screen.getByTestId(AdminPageTabsTestId)).toBeInTheDocument();

    expect(mockComponentTestHelper.get(AdminPageKey)).toEqual([
      expect.objectContaining({
        moduleId: MGGS_MODULE_ID_FINANCE,
        onNavBack,
        title: expect.any(Object),
      }),
    ]);

    expect(mockComponentTestHelper.get(AdminPageTabsKey)).toEqual([
      expect.objectContaining({
        moduleId: MGGS_MODULE_ID_FINANCE,
        extraTabs: [
          expect.objectContaining({
            key: 'settings',
            title: 'Settings',
          }),
        ],
      }),
    ]);
  });
});
