import React from 'react';
import {render, screen} from '@testing-library/react';
import * as XLSX from 'sheetjs-style';
import AttendanceHelper from '../../../components/Attendance/AttendanceHelper';

jest.mock('sheetjs-style', () => ({
  utils: {
    aoa_to_sheet: jest.fn(() => ({sheet: true})),
    book_new: jest.fn(() => ({workbook: true})),
    book_append_sheet: jest.fn(),
  },
  writeFile: jest.fn(),
}));

describe('AttendanceHelper', () => {
  const mockedXlsx = XLSX as jest.Mocked<typeof XLSX>;

  const buildAttendance = (overrides: any = {}) => ({
    AttendanceDate: '2026-02-03T00:00:00.000Z',
    AttendancePeriod: 2,
    ClassCode: 'ENG1',
    ID: '123',
    AttendedFlag: false,
    ClassCancelledFlag: false,
    PossibleAbsenceCode: '',
    PossibleReasonCode: '',
    PossibleDescription: '',
    PossibleAbsenceType: null,
    SynCommunity: {
      NameInternal: 'Ada Lovelace',
    },
    ...overrides,
  });

  test('identifies reportable absences and calculates attendance rate', () => {
    const attendances = [
      buildAttendance({ID: '1'}),
      buildAttendance({ID: '2', AttendedFlag: true}),
      buildAttendance({
        ID: '3',
        PossibleAbsenceCode: 'LATE',
        PossibleAbsenceType: {Code: 'LATE', CountAsAbsenceFlag: true},
      }),
      buildAttendance({
        ID: '4',
        PossibleAbsenceCode: 'APP',
        PossibleAbsenceType: {Code: 'APP', CountAsAbsenceFlag: false},
      }),
      buildAttendance({ID: '5', ClassCancelledFlag: true}),
    ];

    expect(AttendanceHelper.isReportableAbsence(attendances[0] as any)).toBe(true);
    expect(AttendanceHelper.isReportableAbsence(attendances[1] as any)).toBe(false);
    expect(AttendanceHelper.isReportableAbsence(attendances[2] as any)).toBe(true);
    expect(AttendanceHelper.isReportableAbsence(attendances[3] as any)).toBe(false);
    expect(AttendanceHelper.isReportableAbsence(attendances[4] as any)).toBe(false);
    expect(AttendanceHelper.calculateAttendanceRate(attendances as any)).toBe('60.00');
    expect(AttendanceHelper.calculateAttendanceRate([] as any)).toBe('0.00');
  });

  test('renders the reportable absence alert panel', () => {
    render(<>{AttendanceHelper.getReportableAbsenceAlertPanel()}</>);

    expect(screen.getByText(/Reportable Absence:/)).toBeInTheDocument();
  });

  test('generates an attendance workbook and downloads it', () => {
    AttendanceHelper.genAttendanceExcel([
      buildAttendance({
        PossibleAbsenceCode: 'ABS',
        PossibleReasonCode: 'MED',
        PossibleDescription: 'Sick',
        PossibleAbsenceType: {SynergyMeaning: 'Absent'},
      }),
    ] as any);

    expect(mockedXlsx.utils.aoa_to_sheet).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.arrayContaining(['Date', 'Period', 'Class', 'Student ID']),
        expect.arrayContaining(['03 Feb 2026', '2', 'ENG1', '123']),
      ])
    );
    expect(mockedXlsx.utils.book_append_sheet).toHaveBeenCalled();
    expect((mockedXlsx.writeFile as jest.Mock).mock.calls[0]?.[1]).toMatch(
      /^Attendances_\d{4}_\d{2}_\d{2}_\d{2}_\d{2}_\d{2}\.xlsx$/
    );
  });
});
