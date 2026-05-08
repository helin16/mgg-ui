import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import BTGLDetailsPage from '../../../pages/BudgetTracker/BTGLDetailsPage';

jest.mock('../../../pages/BudgetTracker/components/BTGLDetailsPanel', () => {
  return function MockBTGLDetailsPanel() {
    return <div>Details Panel</div>;
  };
});

jest.mock('../../../pages/BudgetTracker/components/BTGLJournalListPanel', () => {
  return function MockBTGLJournalListPanel() {
    return <div>Journal List Panel</div>;
  };
});

jest.mock('../../../pages/BudgetTracker/components/BTGLJournalInMonthPanel', () => {
  return function MockBTGLJournalInMonthPanel() {
    return <div>Journal In Month Panel</div>;
  };
});

jest.mock('../../../pages/BudgetTracker/components/BTItemCreatePopupBtn', () => {
  return function MockBTItemCreatePopupBtn(props: any) {
    return <div>{props.children}</div>;
  };
});

jest.mock('../../../pages/BudgetTracker/components/BTItemBulkCreatePopupBtn', () => {
  return function MockBTItemBulkCreatePopupBtn(props: any) {
    return <div>{props.children}</div>;
  };
});

jest.mock('../../../components/common/LoadingBtn', () => {
  return function MockLoadingBtn(props: any) {
    return <button>{props.children}</button>;
  };
});

jest.mock('../../../services/BudgetTracker/BTLockDownService', () => ({
  getAll: jest.fn(() => Promise.resolve([])),
}));

jest.mock('../../../services/Toaster', () => ({
  __esModule: true,
  default: {
    showApiError: jest.fn(),
  },
}));

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
    expect(view).toContain('Journal In Month Panel');
  });
});
