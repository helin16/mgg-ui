import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import DailySummaryYearLevelEditPopupBtn from '../../../../pages/studentAbsences/components/DailySummaryYearLevelEditPopupBtn';

const mockYearLevelSelector = jest.fn();
const mockLuFormSelector = jest.fn();

jest.mock('../../../../components/common/PopupModal');
jest.mock('../../../../components/student/YearLevelSelector', () => ({
  __esModule: true,
  default: (props: any) => {
    mockYearLevelSelector(props);
    return (
      <button
        type="button"
        data-testid="YearLevelSelector"
        onClick={() => props.onSelect && props.onSelect({value: '12', label: 'Year 12'})}
      >
        YearLevelSelector
      </button>
    );
  },
}));
jest.mock('../../../../components/student/SynFormSelector', () => ({
  __esModule: true,
  default: (props: any) => {
    mockLuFormSelector(props);
    return (
      <button
        type="button"
        data-testid="LuFormSelector"
        onClick={() => props.onSelect && props.onSelect([{value: 'A1'}, {value: 'B2'}])}
      >
        LuFormSelector
      </button>
    );
  },
}));

describe('DailySummaryYearLevelEditPopupBtn', () => {
  beforeEach(() => {
    mockYearLevelSelector.mockClear();
    mockLuFormSelector.mockClear();
  });

  test('excludes existing year levels in create mode and saves sendToHoy with selected forms', () => {
    const onSave = jest.fn();

    render(
      <DailySummaryYearLevelEditPopupBtn
        existingYearLevelCodes={['10', '11']}
        onSave={onSave}
      />
    );

    fireEvent.click(screen.getByRole('button', {name: /add year level/i}));

    expect(mockYearLevelSelector.mock.calls[mockYearLevelSelector.mock.calls.length - 1][0]).toEqual(
      expect.objectContaining({
        excludeCodes: ['10', '11'],
        isDisabled: false,
      })
    );

    fireEvent.click(screen.getByTestId('YearLevelSelector'));
    fireEvent.click(screen.getByTestId('LuFormSelector'));
    fireEvent.click(screen.getByLabelText('Sending to HOY'));
    fireEvent.click(screen.getByRole('button', {name: /save/i}));

    expect(onSave).toHaveBeenCalledWith('12', {
      sendToHoy: false,
      luForms: {
        A1: true,
        B2: true,
      },
    });
  });

  test('does not exclude the current year level in edit mode', () => {
    render(
      <DailySummaryYearLevelEditPopupBtn
        yearLevelCode={'10'}
        rule={{sendToHoy: true, luForms: {A1: true}}}
        existingYearLevelCodes={['11']}
        onSave={jest.fn()}
      >
        Edit
      </DailySummaryYearLevelEditPopupBtn>
    );

    fireEvent.click(screen.getByRole('button', {name: /edit/i}));

    expect(mockYearLevelSelector.mock.calls[mockYearLevelSelector.mock.calls.length - 1][0]).toEqual(
      expect.objectContaining({
        excludeCodes: [],
        isDisabled: true,
        values: ['10'],
      })
    );
  });
});
