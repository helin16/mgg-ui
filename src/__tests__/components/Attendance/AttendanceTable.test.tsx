import React from 'react';
import {render, screen} from '@testing-library/react';
import AttendanceTable from '../../../components/Attendance/AttendanceTable';
import {TableKey, TableTestId} from '../../../components/common/__mocks__/Table';
import ComponentTestHelper from '../../helper/ComponentTestHelper';

jest.mock('../../../components/common/Table');

describe('AttendanceTable', () => {
  ComponentTestHelper.prepare();

  const buildAttendance = (overrides: any = {}) => ({
    AttendanceDate: '2026-02-03T00:00:00.000Z',
    AttendancePeriod: 2,
    ClassCode: 'ENG1',
    ID: '123',
    AttendedFlag: false,
    ClassCancelledFlag: false,
    PossibleDescription: '',
    PossibleAbsenceType: null,
    ...overrides,
  });

  test('sorts rows and includes the student id column by default', () => {
    render(
      <AttendanceTable
        attendances={[
          buildAttendance({ID: '2', AttendanceDate: '2026-02-04T00:00:00.000Z', AttendancePeriod: 3}),
          buildAttendance({ID: '1', AttendanceDate: '2026-02-02T00:00:00.000Z', AttendancePeriod: 1}),
        ] as any}
      />
    );

    expect(screen.getByTestId(TableTestId)).toBeInTheDocument();

    const props = ComponentTestHelper.get(TableKey)[0];
    expect(props.rows.map((row: any) => row.ID)).toEqual(['1', '2']);
    expect(props.columns.map((column: any) => column.key)).toContain('id');
  });

  test('hides the student id column when requested and renders absence state', () => {
    render(
      <AttendanceTable
        showStudentID={false}
        attendances={[
          buildAttendance({
            PossibleAbsenceType: {Code: 'ABS', Description: 'Absent'},
          }),
        ] as any}
      />
    );

    expect(screen.queryByText('123')).not.toBeInTheDocument();
    expect(screen.getByText(/ABS\s+-\s+Absent/)).toBeInTheDocument();

    const props = ComponentTestHelper.get(TableKey)[0];
    expect(props.columns.map((column: any) => column.key)).not.toContain('id');
  });
});
