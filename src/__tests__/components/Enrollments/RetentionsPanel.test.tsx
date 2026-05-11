import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import RetentionsPanel from '../../../components/Enrollments/RetentionsPanel';
import SynVStudentService from '../../../services/Synergetic/Student/SynVStudentService';

jest.mock('../../../components/student/FileYearSelector');
jest.mock('../../../components/form/FormLabel');
jest.mock('../../../components/reports/StudentNumberForecast/components/StudentNumberDetailsPopupBtn');
jest.mock('../../../components/common/Table');
jest.mock('../../../services/Synergetic/Student/SynVStudentService', () => ({
  __esModule: true,
  default: {
    getVPastAndCurrentStudentAll: jest.fn(),
  },
}));
jest.mock('../../../services/Toaster');

describe('RetentionsPanel', () => {
  const mockedService = SynVStudentService as jest.Mocked<typeof SynVStudentService>;

  test('loads retention rows for the selected years', async () => {
    mockedService.getVPastAndCurrentStudentAll.mockResolvedValue({
      data: [
        {StudentID: 1, FileYear: 2025, StudentEntryDate: '2024-01-01', StudentLeavingDate: ''},
      ],
    } as any);

    render(<RetentionsPanel />);

    await waitFor(() => expect(screen.getByText('All Year 12 students who is leaving in Dec are NOT treated as leavers.')).toBeInTheDocument());
    expect(screen.getByTestId('TableTestId')).toBeInTheDocument();
  });
});
