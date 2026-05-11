import React from 'react';
import {render, screen} from '@testing-library/react';
import ComponentTestHelper from '../../helper/ComponentTestHelper';
import {PopupBtnKey, PopupBtnTestId} from '../../../components/common/__mocks__/PopupBtn';
import AbsenceListPopupBtn from '../../../components/Absence/AbsenceListPopupBtn';

jest.mock('../../../components/Absence/AbsencesTable');
jest.mock('../../../components/common/PopupBtn');

describe('AbsenceListPopupBtn', () => {
  ComponentTestHelper.prepare();

  test('passes the popup title and absence table into PopupBtn', () => {
    const absences = [{ID: 1}, {ID: 2}] as any;

    render(<AbsenceListPopupBtn absences={absences}>Open</AbsenceListPopupBtn>);

    expect(screen.getByTestId(PopupBtnTestId)).toBeInTheDocument();
    expect(ComponentTestHelper.get(PopupBtnKey)[0]?.popupProps.title).toBe(
      'List of 2 Absence(s)'
    );
  });
});
