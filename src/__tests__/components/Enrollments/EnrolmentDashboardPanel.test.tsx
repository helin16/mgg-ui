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

  test('adds same-year returning L.O.A. before future statuses and uniques current-year future counts by StudentID', async () => {
    (SynVStudentService.getVPastAndCurrentStudentAll as jest.Mock).mockResolvedValue({
      data: [
        {
          ID: 1,
          StudentID: 100,
          StudentYearLevel: '7',
          StudentStatus: 'APP',
          StudentEntryDate: '2025-01-01',
          StudentLeavingDate: '',
          StudentReturningDate: '',
          StudentOverrideNextYearLevel: '',
          FullFeeFlag: false,
          FileYear: 2026,
        },
        {
          ID: 3,
          StudentID: 200,
          StudentYearLevel: '7',
          StudentStatus: 'LOA',
          StudentEntryDate: '2025-01-01',
          StudentLeavingDate: '2026-03-01',
          StudentReturningDate: '2026-10-01',
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
          FutureEnrolYear: 2026,
          StudentStatus: 'APP',
        },
      ],
    });
    (SynVFutureStudentService.mapFutureStudentToCurrent as jest.Mock).mockImplementation((student) => ({
      ID: student.FutureID,
      StudentID: 100,
      FileYear: student.FutureEnrolYear,
      StudentYearLevel: '7',
      StudentEntryYearLevel: '7',
      StudentStatus: 'APP',
      StudentEntryDate: '2026-01-01',
      StudentLeavingDate: '',
      StudentReturningDate: '',
      StudentOverrideNextYearLevel: '',
      FullFeeFlag: false,
    }));

    const toBlob = jest.fn().mockResolvedValue(new Blob(['pdf'], {type: 'application/pdf'}));
    (pdf as jest.Mock).mockReturnValue({toBlob});
    Object.defineProperty(URL, 'createObjectURL', {writable: true, value: jest.fn().mockReturnValue('blob:pdf')});
    Object.defineProperty(URL, 'revokeObjectURL', {writable: true, value: jest.fn()});
    jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);

    const {container} = render(<EnrolmentDashboardPanel />);

    await waitFor(() => expect(document.querySelector('.spinner-border')).toBeNull());

    const countHeaderRow = container.querySelector('tr.count-header');
    expect(countHeaderRow).not.toBeNull();
    const headerTexts = Array.from(countHeaderRow?.querySelectorAll('th') || []).map(th =>
      `${th.textContent || ''}`.replace(/\s+/g, '').trim()
    );
    expect(headerTexts.indexOf('NOTRETURNINGNEXTYEAR')).toBeGreaterThan(-1);
    expect(headerTexts.indexOf('ReturningL.O.A.')).toBeGreaterThan(headerTexts.indexOf('NOTRETURNINGNEXTYEAR'));
    expect(headerTexts.indexOf('ApplicationFinalised')).toBeGreaterThan(headerTexts.indexOf('ReturningL.O.A.'));

    fireEvent.click(await screen.findByRole('button', {name: /export pdf/i}));

    await waitFor(() => expect(toBlob).toHaveBeenCalled());
    const exportElement = (pdf as jest.Mock).mock.calls[(pdf as jest.Mock).mock.calls.length - 1][0];
    expect(exportElement.props.currentFutureExtraColumnCount).toBe(1);

    const rowWithReturningLoa = exportElement.props.rows.find((row: any) => row.values['current-returning-loa'] === 1);
    expect(rowWithReturningLoa).toBeTruthy();
    expect(rowWithReturningLoa.values['current-status-APP']).toBe(1);
    expect(rowWithReturningLoa.values['current-total-year-end']).toBe(2);
  });
});
