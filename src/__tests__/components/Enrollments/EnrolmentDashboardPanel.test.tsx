import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import EnrolmentDashboardPanel from '../../../components/Enrollments/EnrolmentDashboardPanel';
import MggsModuleService from '../../../services/Module/MggsModuleService';
import SynFileSemesterService from '../../../services/Synergetic/SynFileSemesterService';
import SynLuFutureStatusService from '../../../services/Synergetic/Lookup/SynLuFutureStatusService';
import SynLuCampusService from '../../../services/Synergetic/Lookup/SynLuCampusService';
import SynLuYearLevelService from '../../../services/Synergetic/Lookup/SynLuYearLevelService';
import SynVStudentService from '../../../services/Synergetic/Student/SynVStudentService';
import SynVFutureStudentService from '../../../services/Synergetic/SynVFutureStudentService';
import SynLuTransitionDateService from '../../../services/Synergetic/Lookup/SynLuTransitionDateService';

jest.mock('../../../components/reports/StudentNumberForecast/components/StudentNumberDetailsPopupBtn');
jest.mock('../../../components/student/SynCampusSelector');
jest.mock('../../../components/PanelTitle');
jest.mock('../../../components/common/LoadingBtn');
jest.mock('../../../components/common/ToggleBtn');
jest.mock('../../../services/Module/MggsModuleService', () => ({
  __esModule: true,
  default: {getModule: jest.fn()},
}));
jest.mock('../../../services/Synergetic/SynFileSemesterService', () => ({
  __esModule: true,
  default: {getFileSemesters: jest.fn()},
}));
jest.mock('../../../services/Synergetic/Lookup/SynLuFutureStatusService', () => ({
  __esModule: true,
  default: {getAll: jest.fn()},
}));
jest.mock('../../../services/Synergetic/Lookup/SynLuCampusService', () => ({
  __esModule: true,
  default: {getAllCampuses: jest.fn()},
}));
jest.mock('../../../services/Synergetic/Lookup/SynLuYearLevelService', () => ({
  __esModule: true,
  default: {getAllYearLevels: jest.fn()},
}));
jest.mock('../../../services/Synergetic/Student/SynVStudentService', () => ({
  __esModule: true,
  default: {getVPastAndCurrentStudentAll: jest.fn()},
}));
jest.mock('../../../services/Synergetic/SynVFutureStudentService', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
    mapFutureStudentToCurrent: jest.fn((student, map) => ({
      ID: student.FutureID,
      StudentID: student.FutureID,
      FileYear: student.FutureEnrolYear,
      StudentYearLevel: '7',
      StudentStatus: 'APP',
      StudentEntryDate: '2026-01-01',
      StudentLeavingDate: '',
      StudentOverrideNextYearLevel: '',
    })),
  },
}));
jest.mock('../../../services/Synergetic/Lookup/SynLuTransitionDateService', () => ({
  __esModule: true,
  default: {getAll: jest.fn()},
}));
jest.mock('../../../services/Toaster');

describe('EnrolmentDashboardPanel', () => {
  test('shows the loading spinner while the dashboard data is unresolved', async () => {
    (SynFileSemesterService.getFileSemesters as jest.Mock).mockImplementation(() => new Promise(() => undefined));

    render(<EnrolmentDashboardPanel />);

    await waitFor(() => expect(SynFileSemesterService.getFileSemesters).toHaveBeenCalled());
    expect(document.querySelector('.spinner-border')).toBeTruthy();
  });
});
