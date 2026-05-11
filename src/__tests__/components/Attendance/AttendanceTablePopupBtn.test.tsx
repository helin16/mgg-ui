import React from 'react';
import {render, screen} from '@testing-library/react';
import AttendanceTablePopupBtn from '../../../components/Attendance/AttendanceTablePopupBtn';
import {PopupBtnKey, PopupBtnTestId} from '../../../components/common/__mocks__/PopupBtn';
import ComponentTestHelper from '../../helper/ComponentTestHelper';

jest.mock('../../../components/common/PopupBtn');
jest.mock('../../../components/Attendance/AttendanceTable');

describe('AttendanceTablePopupBtn', () => {
  ComponentTestHelper.prepare();

  test('passes popup content and props through to PopupBtn', () => {
    render(
      <AttendanceTablePopupBtn attendances={[{ID: '1'}] as any} popupTitle="Attendance List">
        Open
      </AttendanceTablePopupBtn>
    );

    expect(screen.getByTestId(PopupBtnTestId)).toBeInTheDocument();
    expect(ComponentTestHelper.get(PopupBtnKey)[0]?.popupProps.title).toBe('Attendance List');
    expect(ComponentTestHelper.get(PopupBtnKey)[0]?.popupProps.dialogClassName).toBe('modal-90w');
  });
});
