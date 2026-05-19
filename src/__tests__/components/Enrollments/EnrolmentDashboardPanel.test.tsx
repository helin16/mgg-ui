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
import {pdf} from '@react-pdf/renderer';

jest.mock('@react-pdf/renderer', () => ({
  pdf: jest.fn(() => ({
    toBlob: jest.fn(),
  })),
  Document: ({children}: any) => children,
  Page: ({children}: any) => children,
  Text: ({children}: any) => children,
  View: ({children}: any) => children,
  StyleSheet: {create: (styles: unknown) => styles},
}));

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
  beforeEach(() => {
    (SynFileSemesterService.getFileSemesters as jest.Mock).mockResolvedValue([{FileYear: 2026}]);
    (MggsModuleService.getModule as jest.Mock).mockResolvedValue({
      settings: {
        enrolmentNumbers: {
          currentFutureStatuses: ['APP'],
          futureStatuses: ['APP'],
        },
      },
    });
    (SynLuFutureStatusService.getAll as jest.Mock).mockResolvedValue([
      {Code: 'APP', Description: 'Application Finalised'},
    ]);
    (SynLuCampusService.getAllCampuses as jest.Mock).mockResolvedValue([
      {Code: 'ELC', Description: 'Early Learning Centre'},
      {Code: 'Junior', Description: 'Junior'},
      {Code: 'Senior', Description: 'Senior'},
    ]);
    (SynLuYearLevelService.getAllYearLevels as jest.Mock).mockResolvedValue([
      {Code: '7', Campus: 'Junior', Description: '7', YearLevelSort: 7},
    ]);
    (SynVStudentService.getVPastAndCurrentStudentAll as jest.Mock).mockResolvedValue({
      data: [
        {
          ID: 1,
          StudentID: 1,
          StudentYearLevel: '7',
          StudentStatus: 'APP',
          StudentEntryDate: '2025-01-01',
          StudentLeavingDate: '',
          StudentReturningDate: '',
          StudentOverrideNextYearLevel: '',
          FullFeeFlag: false,
          FileYear: 2026,
        },
      ],
    });
    (SynVFutureStudentService.getAll as jest.Mock).mockResolvedValue({
      data: [
        {
          FutureID: 2,
          FutureEnrolYear: 2027,
          StudentStatus: 'APP',
        },
      ],
    });
    (SynLuTransitionDateService.getAll as jest.Mock).mockResolvedValue([]);
  });

  test('shows the loading spinner while the dashboard data is unresolved', async () => {
    (SynFileSemesterService.getFileSemesters as jest.Mock).mockImplementation(() => new Promise(() => undefined));

    render(<EnrolmentDashboardPanel />);

    await waitFor(() => expect(SynFileSemesterService.getFileSemesters).toHaveBeenCalled());
    expect(document.querySelector('.spinner-border')).toBeTruthy();
  });

  test('exports the visible table to a landscape pdf', async () => {
    const toBlob = jest.fn().mockResolvedValue(new Blob(['pdf'], {type: 'application/pdf'}));
    (pdf as jest.Mock).mockReturnValue({toBlob});
    const createObjectURLMock = jest.fn().mockReturnValue('blob:pdf');
    const revokeObjectURLMock = jest.fn();
    Object.defineProperty(URL, 'createObjectURL', {writable: true, value: createObjectURLMock});
    Object.defineProperty(URL, 'revokeObjectURL', {writable: true, value: revokeObjectURLMock});
    const anchorClickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);

    render(<EnrolmentDashboardPanel />);

    const exportBtn = await screen.findByRole('button', {name: /export pdf/i});
    await waitFor(() => expect(document.querySelector('.spinner-border')).toBeNull());
    fireEvent.click(exportBtn);

    await waitFor(() => expect(toBlob).toHaveBeenCalled());
    expect(pdf).toHaveBeenCalled();
    expect(createObjectURLMock).toHaveBeenCalled();
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:pdf');

    anchorClickSpy.mockRestore();
  });
});
