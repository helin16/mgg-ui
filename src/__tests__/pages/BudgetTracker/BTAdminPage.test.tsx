import React from 'react';
import {render} from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import BTAdminPage from '../../../pages/BudgetTracker/BTAdminPage';
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

  test('renders page composition', () => {
    const onNavBack = jest.fn();
    const setShowingAdminPageModule = jest.fn();
    const {container} = render(<BTAdminPage onNavBack={onNavBack} adminPageModule={null} setShowingAdminPageModule={setShowingAdminPageModule} />);

    expect(container).not.toBeEmptyDOMElement();
  });
});
