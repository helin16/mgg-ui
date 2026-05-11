import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import AttendanceRatePopupBtn from '../../../components/Attendance/AttendanceRatePopupBtn';
import {PopupBtnKey, PopupBtnTestId} from '../../../components/common/__mocks__/PopupBtn';
import {TableKey} from '../../../components/common/__mocks__/Table';
import ComponentTestHelper from '../../helper/ComponentTestHelper';

jest.mock('../../../components/common/PopupBtn');
jest.mock('../../../components/common/Table');

describe('AttendanceRatePopupBtn', () => {
  ComponentTestHelper.prepare();

  const buildAttendance = (overrides: any = {}) => ({
    AttendanceDate: '2026-02-03T00:00:00.000Z',
    AttendancePeriod: 2,
    ClassCode: 'ENG1',
    ID: '123',
    AttendedFlag: false,
    ClassCancelledFlag: false,
    PossibleAbsenceCode: '',
    PossibleAbsenceType: null,
    ...overrides,
  });

  test('shows attendance totals and swaps the displayed attendance set', () => {
    render(
      <AttendanceRatePopupBtn
        attendances={[
          buildAttendance({ID: '1'}),
          buildAttendance({ID: '2', AttendedFlag: true}),
        ] as any}
      >
        Open
      </AttendanceRatePopupBtn>
    );

    expect(screen.getByTestId(PopupBtnTestId)).toBeInTheDocument();
    expect(ComponentTestHelper.get(PopupBtnKey)[0]?.popupProps.title).toBe('Attendance Rate (%)');
    expect(screen.getByText(/50\.00/)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', {name: '1'})[0]);

    const tableCalls = ComponentTestHelper.get(TableKey);
    expect(tableCalls[tableCalls.length - 1]?.rows).toHaveLength(1);
  });
});
