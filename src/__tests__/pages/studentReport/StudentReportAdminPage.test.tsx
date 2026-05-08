import React from 'react';
import {render, screen} from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import { AdminPageKey, AdminPageTestId } from '../../../layouts/__mocks__/AdminPage';
import { AdminPageTabsKey, AdminPageTabsTestId } from '../../../layouts/__mocks__/AdminPageTabs';
import StudentReportAdminPage from '../../../pages/studentReport/StudentReportAdminPage';
import { AdminReportListKey, AdminReportListTestId } from '../../../pages/studentReport/components/Admin/__mocks__/AdminReportList';
import { AdminEditReportYearKey, AdminEditReportYearTestId } from '../../../pages/studentReport/components/Admin/__mocks__/AdminEditReportYear';
import { AdminEditingLockListKey, AdminEditingLockListTestId } from '../../../pages/studentReport/components/Admin/__mocks__/AdminEditingLockList';
import { SchoolManagementPanelKey, SchoolManagementPanelTestId } from '../../../components/SchoolManagement/__mocks__/SchoolManagementPanel';
import { GenComparativePopupBtnKey, GenComparativePopupBtnTestId } from '../../../pages/studentReport/components/Admin/__mocks__/GenComparativePopupBtn';
import { ExplanationPanelKey, ExplanationPanelTestId } from '../../../components/__mocks__/ExplanationPanel';
import { ReportsUploaderKey, ReportsUploaderTestId } from '../../../pages/studentReport/components/Admin/__mocks__/ReportsUploader';
jest.mock('../../../layouts/AdminPage');
jest.mock('../../../layouts/AdminPageTabs');
jest.mock('../../../pages/studentReport/components/Admin/AdminReportList');
jest.mock('../../../pages/studentReport/components/Admin/AdminEditReportYear');
jest.mock('../../../pages/studentReport/components/Admin/AdminEditingLockList');
jest.mock('../../../components/SchoolManagement/SchoolManagementPanel');
jest.mock('../../../pages/studentReport/components/Admin/GenComparativePopupBtn');
jest.mock('../../../components/ExplanationPanel');
jest.mock('../../../pages/studentReport/components/Admin/ReportsUploader');

describe('StudentReportAdminPage', () => {
  mockComponentTestHelper.prepare();

  test('renders page composition', () => {
    const onNavBack = jest.fn();
    const {container} = render(<StudentReportAdminPage onNavBack={onNavBack} />);

    expect(screen.getByTestId(AdminPageTestId)).toBeInTheDocument();
    expect(mockComponentTestHelper.get(AdminPageKey).length).toBeGreaterThan(0);

    expect(mockComponentTestHelper.get(AdminPageTabsKey).length).toBeGreaterThan(0);
    expect(container).not.toBeEmptyDOMElement();
  });
});
