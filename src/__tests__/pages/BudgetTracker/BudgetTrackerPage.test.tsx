import React from 'react';
import { render } from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import BudgetTrackerPage from '../../../pages/BudgetTracker/BudgetTrackerPage';
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
