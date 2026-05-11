import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import ShortTermStayNumbers from '../../../components/Enrollments/ShortTermStayNumbers';
import SynLuYearLevelService from '../../../services/Synergetic/Lookup/SynLuYearLevelService';
import SynVStudentService from '../../../services/Synergetic/Student/SynVStudentService';

jest.mock('../../../components/student/FileYearSelector');
jest.mock('../../../components/form/FormLabel');
jest.mock('../../../components/reports/StudentNumberForecast/components/StudentNumberDetailsPopupBtn');
jest.mock('../../../components/common/Table');
jest.mock('../../../services/Synergetic/Lookup/SynLuYearLevelService', () => ({
  __esModule: true,
  default: {
    getAllYearLevels: jest.fn(),
  },
}));
jest.mock('../../../services/Synergetic/Student/SynVStudentService', () => ({
  __esModule: true,
  default: {
    getVPastAndCurrentStudentAll: jest.fn(),
  },
}));
jest.mock('../../../services/Toaster');

describe('ShortTermStayNumbers', () => {
  const mockedYearLevels = SynLuYearLevelService as jest.Mocked<typeof SynLuYearLevelService>;
  const mockedStudents = SynVStudentService as jest.Mocked<typeof SynVStudentService>;

  test('loads short term stay numbers into the table', async () => {
    mockedYearLevels.getAllYearLevels.mockResolvedValue([
      {Code: '7', Description: 'Year 7'},
    ] as any);
    mockedStudents.getVPastAndCurrentStudentAll.mockResolvedValue({
      data: [
        {StudentID: 1, FileYear: 2025, StudentYearLevel: '7'},
      ],
    } as any);

    render(<ShortTermStayNumbers />);

    await waitFor(() => expect(screen.getByText(/Short Terms Stay Students/i)).toBeInTheDocument());
    expect(screen.getByTestId('TableTestId')).toBeInTheDocument();
  });
});
