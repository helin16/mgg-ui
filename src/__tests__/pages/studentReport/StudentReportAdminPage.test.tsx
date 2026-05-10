import React from 'react';
import { render, screen } from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import { AdminPageKey, AdminPageTestId } from '../../../layouts/__mocks__/AdminPage';
import { AdminPageTabsKey } from '../../../layouts/__mocks__/AdminPageTabs';
import StudentReportAdminPage from '../../../pages/studentReport/StudentReportAdminPage';
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
