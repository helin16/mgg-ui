import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import EnrolmentsProjectedNumbers from '../../../components/Enrollments/EnrolmentsProjectedNumbers';
import SynLuFutureStatusService from '../../../services/Synergetic/Lookup/SynLuFutureStatusService';
import SynVFutureStudentService from '../../../services/Synergetic/SynVFutureStudentService';
import SynVStudentService from '../../../services/Synergetic/Student/SynVStudentService';

jest.mock('../../../components/student/FileYearSelector');
jest.mock('../../../components/form/FormLabel');
jest.mock('../../../components/reports/StudentNumberForecast/components/StudentNumberDetailsPopupBtn');
jest.mock('../../../components/lookup/SynLuFutureStatusSelector');
jest.mock('../../../components/common/Table');
jest.mock('../../../services/Synergetic/Lookup/SynLuFutureStatusService', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
  },
}));
jest.mock('../../../services/Synergetic/SynVFutureStudentService', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
    mapFutureStudentToCurrent: jest.fn((student) => ({StudentID: student.FutureID, StudentStatus: student.FutureStatus})),
  },
}));
jest.mock('../../../services/Synergetic/Student/SynVStudentService', () => ({
  __esModule: true,
  default: {
    getCurrentVStudents: jest.fn(),
  },
}));
jest.mock('../../../services/Toaster');

describe('EnrolmentsProjectedNumbers', () => {
  const mockedStatusService = SynLuFutureStatusService as jest.Mocked<typeof SynLuFutureStatusService>;
  const mockedFutureService = SynVFutureStudentService as jest.Mocked<typeof SynVFutureStudentService>;
  const mockedStudentService = SynVStudentService as jest.Mocked<typeof SynVStudentService>;

  test('shows the loading spinner while future projections are unresolved', async () => {
    mockedStatusService.getAll.mockImplementation(() => new Promise(() => undefined));
    mockedFutureService.getAll.mockImplementation(() => new Promise(() => undefined));
    mockedStudentService.getCurrentVStudents.mockImplementation(() => new Promise(() => undefined));

    render(<EnrolmentsProjectedNumbers />);

    await waitFor(() => expect(mockedFutureService.getAll).toHaveBeenCalled());
    expect(document.querySelector('.spinner-border')).toBeTruthy();
  });
});
