import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import BTGLDetailsPage from '../../../pages/BudgetTracker/BTGLDetailsPage';
import { BTGLJournalInMonthPanelTestId } from '../../../pages/BudgetTracker/components/__mocks__/BTGLJournalInMonthPanel';

jest.mock('../../../pages/BudgetTracker/components/BTGLDetailsPanel');
jest.mock('../../../pages/BudgetTracker/components/BTGLJournalListPanel');
jest.mock('../../../pages/BudgetTracker/components/BTGLJournalInMonthPanel');
jest.mock('../../../pages/BudgetTracker/components/BTItemCreatePopupBtn');
jest.mock('../../../pages/BudgetTracker/components/BTItemBulkCreatePopupBtn');
jest.mock('../../../components/common/LoadingBtn');
jest.mock('../../../services/BudgetTracker/BTLockDownService');
jest.mock('../../../services/Toaster');

describe('BTGLDetailsPage', () => {
  test('renders options with new item and bulk create item buttons', () => {
    const view = renderToStaticMarkup(
      <BTGLDetailsPage
        gl={{ GLCode: '708705', GLDescription: '$20 Boss Program' } as any}
        selectedYear={2027}
        onNavBack={() => null}
      />
    );

    expect(view).toContain('Navigation');
    expect(view).toContain('Options');
    expect(view).toContain('New Item');
    expect(view).toContain('Bulk Create Items');
    expect(view).toContain(BTGLJournalInMonthPanelTestId);
  });
});
