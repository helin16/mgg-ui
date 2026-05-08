import React from 'react';
import {render, screen} from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import BudgetTrackerPage from '../../../pages/BudgetTracker/BudgetTrackerPage';
import { BTGLListPanelKey, BTGLListPanelTestId } from '../../../pages/BudgetTracker/components/__mocks__/BTGLListPanel';
import { BTGLDetailsPageKey, BTGLDetailsPageTestId } from '../../../pages/BudgetTracker/__mocks__/BTGLDetailsPage';
import { BTAdminOptionsPanelKey, BTAdminOptionsPanelTestId } from '../../../pages/BudgetTracker/components/admin/__mocks__/BTAdminOptionsPanel';
import { BTAdminPageKey, BTAdminPageTestId } from '../../../pages/BudgetTracker/__mocks__/BTAdminPage';
jest.mock('../../../pages/BudgetTracker/components/BTGLListPanel');
jest.mock('../../../pages/BudgetTracker/BTGLDetailsPage');
jest.mock('../../../pages/BudgetTracker/components/admin/BTAdminOptionsPanel');
jest.mock('../../../pages/BudgetTracker/BTAdminPage');

describe('BudgetTrackerPage', () => {
  mockComponentTestHelper.prepare();

  test('renders page composition', () => {
    const {container} = render(<BudgetTrackerPage />);

    expect(container).not.toBeEmptyDOMElement();
  });
});
