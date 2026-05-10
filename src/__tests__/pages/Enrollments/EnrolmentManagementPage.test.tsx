import React from 'react';
import {render, screen} from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import { PageKey, PageTestId } from '../../../layouts/__mocks__/Page';
import EnrolmentManagementPage from '../../../pages/Enrollments/EnrolmentManagementPage';
import { EnrolmentManagementAdminPageKey, EnrolmentManagementAdminPageTestId } from '../../../pages/Enrollments/__mocks__/EnrolmentManagementAdminPage';
import { SectionDivKey, SectionDivTestId } from '../../../components/common/__mocks__/SectionDiv';
import { ExpiringPassportsAndVisasKey, ExpiringPassportsAndVisasTestId } from '../../../components/Enrollments/__mocks__/ExpiringPassportsAndVisas';
import { StudentNumberForecastDashboardKey, StudentNumberForecastDashboardTestId } from '../../../components/reports/StudentNumberForecast/__mocks__/StudentNumberForecastDashboard';
import { VRQAPanelKey, VRQAPanelTestId } from '../../../pages/dataSubmissions/components/VRQA/__mocks__/VRQAPanel';
import { AttendancesListWithSearchPanelKey, AttendancesListWithSearchPanelTestId } from '../../../components/Attendance/__mocks__/AttendancesListWithSearchPanel';
import { EnrolmentDashboardPanelKey, EnrolmentDashboardPanelTestId } from '../../../components/Enrollments/__mocks__/EnrolmentDashboardPanel';
jest.mock('../../../layouts/Page');
jest.mock('../../../pages/Enrollments/EnrolmentManagementAdminPage');
jest.mock('../../../components/common/SectionDiv');
jest.mock('../../../components/Enrollments/ExpiringPassportsAndVisas');
jest.mock('../../../components/reports/StudentNumberForecast/StudentNumberForecastDashboard');
jest.mock('../../../pages/dataSubmissions/components/VRQA/VRQAPanel');
jest.mock('../../../components/Attendance/AttendancesListWithSearchPanel');
jest.mock('../../../components/Enrollments/EnrolmentDashboardPanel');

describe('EnrolmentManagementPage', () => {
  mockComponentTestHelper.prepare();

  test('renders page composition', () => {
    const {container} = render(<EnrolmentManagementPage />);

    expect(screen.getByTestId(PageTestId)).toBeInTheDocument();
    expect(mockComponentTestHelper.get(PageKey).length).toBeGreaterThan(0);

    expect(container).not.toBeEmptyDOMElement();
  });
});
