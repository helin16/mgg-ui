import React from 'react';
import {render, screen} from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import {ModuleAccessWrapperKey, ModuleAccessWrapperTestId} from '../../../components/module/__mocks__/ModuleAccessWrapper';
import {Page401Key, Page401TestId} from '../../../components/__mocks__/Page401';
import {BTAdminOptionsPanelKey, BTAdminOptionsPanelTestId} from '../../../pages/BudgetTracker/components/admin/__mocks__/BTAdminOptionsPanel';
import {BTUserAdminPanelTestId} from '../../../pages/BudgetTracker/components/admin/__mocks__/BTUserAdminPanel';
import {BTNotificationsAdminPanelTestId} from '../../../pages/BudgetTracker/components/admin/__mocks__/BTNotificationsAdminPanel';
import BTAdminPage from '../../../pages/BudgetTracker/BTAdminPage';
import {
  BT_ADMIN_OPTION_NOTIFICATIONS,
  BT_ADMIN_OPTION_USERS,
} from '../../../pages/BudgetTracker/components/admin/BTAdminOptionsPanel';
import {MGGS_MODULE_ID_BUDGET_TRACKER} from '../../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN} from '../../../types/modules/iRole';
jest.mock('../../../components/module/ModuleAccessWrapper');
jest.mock('../../../pages/BudgetTracker/components/admin/BTAdminOptionsPanel');
jest.mock('../../../components/Page401');
jest.mock('../../../pages/BudgetTracker/components/admin/BTUserAdminPanel');
jest.mock('../../../pages/BudgetTracker/components/admin/BTItemsDownloadPanel');
jest.mock('../../../pages/BudgetTracker/components/admin/BTItemCategoryAdminPanel');
jest.mock('../../../pages/BudgetTracker/components/admin/BTExcludeGLAdminPanel');
jest.mock('../../../pages/BudgetTracker/components/admin/BTLockDownAdminPanel');
jest.mock('../../../pages/BudgetTracker/components/admin/BTConsolidatedReportsPanel');
jest.mock('../../../pages/BudgetTracker/components/admin/BTNotificationsAdminPanel');
jest.mock('../../../components/reports/BudgetForecast/BudgetForecastPanel');

describe('BTAdminPage', () => {
  mockComponentTestHelper.prepare();

  test('renders the selected admin panel inside the access wrapper', () => {
    const onNavBack = jest.fn();
    const setShowingAdminPageModule = jest.fn();
    render(
      <BTAdminPage
        onNavBack={onNavBack}
        adminPageModule={BT_ADMIN_OPTION_USERS}
        setShowingAdminPageModule={setShowingAdminPageModule}
      />
    );

    expect(screen.getByTestId(ModuleAccessWrapperTestId)).toBeInTheDocument();
    expect(screen.getByTestId(BTUserAdminPanelTestId)).toBeInTheDocument();
    expect(mockComponentTestHelper.get(ModuleAccessWrapperKey)[0]).toMatchObject({
      moduleId: MGGS_MODULE_ID_BUDGET_TRACKER,
      roleId: ROLE_ID_ADMIN,
    });
    expect(mockComponentTestHelper.get(BTAdminOptionsPanelKey)[0]).toMatchObject({
      onSelectAdminModule: setShowingAdminPageModule,
    });
  });

  test('renders page401 for an unknown admin module', () => {
    const onNavBack = jest.fn();
    const setShowingAdminPageModule = jest.fn();
    render(
      <BTAdminPage
        onNavBack={onNavBack}
        adminPageModule={'missing-module' as any}
        setShowingAdminPageModule={setShowingAdminPageModule}
      />
    );

    expect(screen.getByTestId(Page401TestId)).toBeInTheDocument();
    expect(mockComponentTestHelper.get(Page401Key)[0]?.title).toBe('Not Found');
  });

  test('renders a different admin branch when notifications is selected', () => {
    const onNavBack = jest.fn();
    const setShowingAdminPageModule = jest.fn();
    render(
      <BTAdminPage
        onNavBack={onNavBack}
        adminPageModule={BT_ADMIN_OPTION_NOTIFICATIONS}
        setShowingAdminPageModule={setShowingAdminPageModule}
      />
    );

    expect(screen.getByTestId(BTNotificationsAdminPanelTestId)).toBeInTheDocument();
    expect(screen.getByTestId(BTAdminOptionsPanelTestId)).toBeInTheDocument();
  });
});
