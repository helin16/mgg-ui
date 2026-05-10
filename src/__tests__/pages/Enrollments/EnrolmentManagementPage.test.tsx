import React from 'react';
import { render, screen } from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import { PageKey, PageTestId } from '../../../layouts/__mocks__/Page';
import EnrolmentManagementPage from '../../../pages/Enrollments/EnrolmentManagementPage';
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
