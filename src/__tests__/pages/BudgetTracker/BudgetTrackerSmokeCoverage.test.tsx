/* eslint-disable testing-library/render-result-naming-convention */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import BTAdminPage from '../../../pages/BudgetTracker/BTAdminPage';
import BudgetTrackerPage from '../../../pages/BudgetTracker/BudgetTrackerPage';
import BTGLJournalInMonthPanel from '../../../pages/BudgetTracker/components/BTGLJournalInMonthPanel';
import BTGLJournalListPanel from '../../../pages/BudgetTracker/components/BTGLJournalListPanel';
import BTGLListPanel from '../../../pages/BudgetTracker/components/BTGLListPanel';
import BTGLTable from '../../../pages/BudgetTracker/components/BTGLTable';
import BTItemBulkCreatePopupBtn from '../../../pages/BudgetTracker/components/BTItemBulkCreatePopupBtn';
import BTItemCategorySelector from '../../../pages/BudgetTracker/components/BTItemCategorySelector';
import BTItemCreatePopupBtn from '../../../pages/BudgetTracker/components/BTItemCreatePopupBtn';
import BTItemEditPanel from '../../../pages/BudgetTracker/components/BTItemEditPanel';
import BTItemExportBtn from '../../../pages/BudgetTracker/components/BTItemExportBtn';
import BTLockdownPanel from '../../../pages/BudgetTracker/components/BTLockdownPanel';
import SynGLSelector from '../../../pages/BudgetTracker/components/SynGLSelector';
import BTAdminOptionsPanel, {
  BT_ADMIN_OPTION_USERS,
} from '../../../pages/BudgetTracker/components/admin/BTAdminOptionsPanel';
import BTConsolidatedReportsPanel from '../../../pages/BudgetTracker/components/admin/BTConsolidatedReportsPanel';
import BTExcludeCodeDetailsPopup from '../../../pages/BudgetTracker/components/admin/BTExcludeCodeDetailsPopup';
import BTExcludeGLAdminPanel from '../../../pages/BudgetTracker/components/admin/BTExcludeGLAdminPanel';
import BTItemCategoryAdminPanel from '../../../pages/BudgetTracker/components/admin/BTItemCategoryAdminPanel';
import BTItemCategoryDetailsPopup from '../../../pages/BudgetTracker/components/admin/BTItemCategoryDetailsPopup';
import BTItemsDownloadPanel from '../../../pages/BudgetTracker/components/admin/BTItemsDownloadPanel';
import BTLockDownAdminPanel from '../../../pages/BudgetTracker/components/admin/BTLockDownAdminPanel';
import BTLockDownCreatePopup from '../../../pages/BudgetTracker/components/admin/BTLockDownCreatePopup';
import BTUserAdminPanel from '../../../pages/BudgetTracker/components/admin/BTUserAdminPanel';

jest.mock('react-redux', () => ({
  useSelector: (selector: any) =>
    selector({
      auth: {
        user: {
          synergyId: 100,
          Given1: 'Lin',
          Surname: 'He',
        },
      },
    }),
}));

jest.mock('../../../components/common/PageLoadingSpinner', () => {
  return function MockPageLoadingSpinner() {
    return <div>Loading...</div>;
  };
});

jest.mock('../../../components/common/PopupModal', () => {
  return function MockPopupModal(props: any) {
    return (
      <div>
        <div>{props.title || props.header}</div>
        <div>{props.children}</div>
        <div>{props.footer}</div>
      </div>
    );
  };
});

jest.mock('../../../components/common/LoadingBtn', () => {
  return function MockLoadingBtn(props: any) {
    return <button>{props.children}</button>;
  };
});

jest.mock('../../../components/student/FileYearSelector', () => {
  return function MockFileYearSelector(props: any) {
    return <div>FileYearSelector:{props.value}</div>;
  };
});

jest.mock('../../../components/common/SelectBox', () => {
  return function MockSelectBox(props: any) {
    const options = props.options || [];
    return <div>SelectBox:{options.length}</div>;
  };
});

jest.mock('../../../components/PanelTitle', () => {
  return function MockPanelTitle(props: any) {
    return <div>{props.children}</div>;
  };
});

jest.mock('../../../components/ExplanationPanel', () => {
  return function MockExplanationPanel(props: any) {
    return <div>{props.text}</div>;
  };
});

jest.mock('../../../components/module/ModuleAdminBtn', () => {
  return function MockModuleAdminBtn() {
    return <button>Admin</button>;
  };
});

jest.mock('../../../components/module/ModuleAccessWrapper', () => {
  return function MockModuleAccessWrapper(props: any) {
    return <div>{props.children}</div>;
  };
});

jest.mock('../../../components/Page401', () => {
  return function MockPage401(props: any) {
    return (
      <div>
        <div>{props.title}</div>
        <div>{props.description}</div>
        <div>{props.btns}</div>
      </div>
    );
  };
});

jest.mock('../../../components/module/ModuleUserList', () => {
  return function MockModuleUserList() {
    return <div>ModuleUserList</div>;
  };
});

jest.mock('../../../components/module/ModuleEmailTemplateNameEditor', () => {
  return function MockModuleEmailTemplateNameEditor() {
    return <div>ModuleEmailTemplateNameEditor</div>;
  };
});

jest.mock('../../../components/reports/BudgetForecast/BudgetForecastPanel', () => {
  return function MockBudgetForecastPanel() {
    return <div>BudgetForecastPanel</div>;
  };
});

jest.mock('../../../components/form/FormLabel', () => {
  return function MockFormLabel(props: any) {
    return <label>{props.label}</label>;
  };
});

jest.mock('../../../components/form/FormErrorDisplay', () => ({
  __esModule: true,
  default: function MockFormErrorDisplay() {
    return <div />;
  },
}));

jest.mock('../../../components/common/DateTimePicker', () => {
  return function MockDateTimePicker() {
    return <div>DateTimePicker</div>;
  };
});

jest.mock('../../../services/Toaster', () => ({
  __esModule: true,
  default: {
    showApiError: jest.fn(),
    showToast: jest.fn(),
  },
  TOAST_TYPE_ERROR: 'error',
  TOAST_TYPE_SUCCESS: 'success',
  TOAST_TYPE_INFO: 'info',
}));

const gl = {
  GLCode: '708705',
  GLDescription: '$20 Boss Program',
  GeneralLedgerSeq: 11,
  CurrentBalance: 125,
} as any;

describe('BudgetTracker smoke coverage', () => {
  test('renders untested top-level pages', () => {
    const view = renderToStaticMarkup(<BudgetTrackerPage />);
    const adminView = renderToStaticMarkup(
      <BTAdminPage
        onNavBack={() => null}
        adminPageModule={BT_ADMIN_OPTION_USERS}
        setShowingAdminPageModule={() => null}
      />
    );
    const notFoundView = renderToStaticMarkup(
      <BTAdminPage
        onNavBack={() => null}
        adminPageModule={'missing' as any}
        setShowingAdminPageModule={() => null}
      />
    );

    expect(view).toContain('Budget Tracker');
    expect(view).toContain('Hide Zero Balance');
    expect(adminView).toContain('BT Admin');
    expect(adminView).toContain('Admin Users');
    expect(notFoundView).toContain('Not Found');
  });

  test('renders untested list and journal components', () => {
    const view = renderToStaticMarkup(
      <BTGLListPanel
        selectedYear={2026}
        onChangeYear={() => null}
        onSelectGL={() => null}
        setShowingAdminPageModule={() => null}
      />
    );
    const tableView = renderToStaticMarkup(
      <BTGLTable
        selectedYear={2026}
        glCodesResults={{
          data: [gl],
          page: 1,
          perPage: 20,
          total: 1,
        } as any}
        onSelectGL={() => null}
      />
    );
    const journalView = renderToStaticMarkup(
      <BTGLJournalListPanel
        gl={gl}
        year={2027}
        onYearChange={() => null}
      />
    );
    const monthView = renderToStaticMarkup(
      <BTGLJournalInMonthPanel gl={gl} year={2027} />
    );

    expect(view).toContain('Budget Tracker');
    expect(view).toContain('GLs: below accounts are signed to you within Synergetic');
    expect(tableView).toContain('GL Code / Description');
    expect(tableView).toContain('708705 - $20 Boss Program');
    expect(journalView).toContain('Journals for: 708705 - $20 Boss Program');
    expect(journalView).toContain('Date');
    expect(monthView).toContain('Actual Spent in 2027');
    expect(monthView).toContain('January');
    expect(monthView).toContain('Total');
  });

  test('renders untested item entry and selector components', () => {
    const view = renderToStaticMarkup(
      <BTItemBulkCreatePopupBtn gl={gl} forYear={2027} onItemsSaved={() => null}>
        <span>Bulk Button</span>
      </BTItemBulkCreatePopupBtn>
    );
    const createView = renderToStaticMarkup(
      <BTItemCreatePopupBtn
        gl={gl}
        forYear={2027}
        onItemSaved={() => null}
        btItem={{}}
      >
        <span>Create Button</span>
      </BTItemCreatePopupBtn>
    );
    const categoryView = renderToStaticMarkup(
      <BTItemCategorySelector value={null} onSelect={() => null} />
    );
    const selectorView = renderToStaticMarkup(
      <SynGLSelector values={null} onSelect={() => null} />
    );
    const editView = renderToStaticMarkup(
      <BTItemEditPanel
        gl={gl}
        forYear={2027}
        onItemSaved={() => null}
        onCancel={() => null}
      />
    );
    const exportView = renderToStaticMarkup(
      <BTItemExportBtn gl={gl} year={2027} items={[]} />
    );
    const lockView = renderToStaticMarkup(
      <BTLockdownPanel
        btLockDown={{ year: 2027, lockdown: '2099-01-01T00:00:00.000Z' } as any}
      />
    );

    expect(view).toContain('Bulk Button');
    expect(createView).toContain('Create Button');
    expect(categoryView).toContain('SelectBox:0');
    expect(selectorView).toContain('SelectBox:0');
    expect(editView).toContain('Budget Category:');
    expect(editView).toContain('Item Name:');
    expect(editView).toContain('Reason For Purchase:');
    expect(exportView).toContain('Export');
    expect(lockView).toContain('Budget Tracker for');
    expect(lockView).toContain('will be locked down');
  });

  test('renders untested admin option and popup components', () => {
    const view = renderToStaticMarkup(
      <BTAdminOptionsPanel
        onSelectAdminModule={() => null}
        preExtraBtns={<div>Extra Btn</div>}
      />
    );
    const excludeView = renderToStaticMarkup(
      <BTExcludeCodeDetailsPopup onSaved={() => null}>
        <span>New Exclude Code</span>
      </BTExcludeCodeDetailsPopup>
    );
    const categoryView = renderToStaticMarkup(
      <BTItemCategoryDetailsPopup onSaved={() => null}>
        <span>New Category</span>
      </BTItemCategoryDetailsPopup>
    );
    const lockView = renderToStaticMarkup(
      <BTLockDownCreatePopup onSaved={() => null} />
    );

    expect(view).toContain('Admin Options');
    expect(view).toContain('Download Budget Items');
    expect(view).toContain('Consolidated Reports');
    expect(view).toContain('Forecast');
    expect(excludeView).toContain('New Exclude Code');
    expect(categoryView).toContain('New Category');
    expect(lockView).toContain('Lock down for budget year');
  });

  test('renders untested admin panels', () => {
    const view = renderToStaticMarkup(<BTConsolidatedReportsPanel />);
    const excludeView = renderToStaticMarkup(<BTExcludeGLAdminPanel />);
    const categoryView = renderToStaticMarkup(<BTItemCategoryAdminPanel />);
    const downloadView = renderToStaticMarkup(<BTItemsDownloadPanel />);
    const lockView = renderToStaticMarkup(
      <BTLockDownAdminPanel onSelectAdminModule={() => null} />
    );
    const userView = renderToStaticMarkup(<BTUserAdminPanel />);

    expect(view).toContain('NOTE: Requested value and Approved value are pulled from Budget Tracker Items');
    expect(view).toContain('Current Year');
    expect(excludeView).toContain('NOTE: all the GLCodes list below will be hidden on the glcode list.');
    expect(categoryView).toContain('NOTE: all Destination GL Codes are NOT reflected by Year!!!');
    expect(downloadView).toContain('Please select a year to start download');
    expect(downloadView).toContain('Download');
    expect(lockView).toContain('After the lock down:');
    expect(lockView).toContain('Lock down for budget year');
    expect(userView).toContain('Admin Users:');
    expect(userView).toContain('ModuleUserList');
  });
});
