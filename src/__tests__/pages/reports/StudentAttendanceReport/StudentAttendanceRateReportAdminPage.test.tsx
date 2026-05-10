import React from 'react';
import { render, screen } from '@testing-library/react';
import mockComponentTestHelper from '../../../helper/ComponentTestHelper';
import { AdminPageKey, AdminPageTestId } from '../../../../layouts/__mocks__/AdminPage';
import { AdminPageTabsKey } from '../../../../layouts/__mocks__/AdminPageTabs';
import StudentAttendanceRateReportAdminPage from '../../../../pages/reports/StudentAttendanceReport/StudentAttendanceRateReportAdminPage';
jest.mock('../../../../layouts/AdminPage');
jest.mock('../../../../layouts/AdminPageTabs');
jest.mock('../../../../components/common/SectionDiv');
jest.mock('../../../../components/ExplanationPanel');
jest.mock('../../../../components/module/ModuleUserList');
jest.mock('../../../../components/SchoolManagement/SchoolManagementTable');
jest.mock('../../../../pages/reports/StudentAttendanceReport/components/StudentAttendanceRateReportModuleSettings');

describe('StudentAttendanceRateReportAdminPage', () => {
  mockComponentTestHelper.prepare();

  test('renders page composition', () => {
    const onNavBack = jest.fn();
    const {container} = render(<StudentAttendanceRateReportAdminPage onNavBack={onNavBack} />);

    expect(screen.getByTestId(AdminPageTestId)).toBeInTheDocument();
    expect(mockComponentTestHelper.get(AdminPageKey).length).toBeGreaterThan(0);

    expect(mockComponentTestHelper.get(AdminPageTabsKey).length).toBeGreaterThan(0);
    expect(container).not.toBeEmptyDOMElement();
  });
});
