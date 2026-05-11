import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComponentTestHelper from '../helper/ComponentTestHelper';
import {
  DateRangeSelectorKey,
  DateRangeSelectorTestId,
} from '../../components/common/__mocks__/DateRangeSelector';
import {
  SynFileSemesterSelectorKey,
  SynFileSemesterSelectorOption,
  SynFileSemesterSelectorTestId,
} from '../../components/student/__mocks__/SynFileSemesterSelector';
import DateRangeWithFileSemesterSelector from '../../components/DateRangeWithFileSemesterSelector';

jest.mock('../../components/common/DateRangeSelector');
jest.mock('../../components/student/SynFileSemesterSelector');

describe('DateRangeWithFileSemesterSelector', () => {
  ComponentTestHelper.prepare();

  test('emits the initial explicit date range and updates when dates are picked', async () => {
    const onSelect = jest.fn();
    render(
      <DateRangeWithFileSemesterSelector
        defaultStartDate="2026-01-01T00:00:00Z"
        defaultEndDate="2026-01-31T00:00:00Z"
        onSelect={onSelect}
      />
    );

    await waitFor(() =>
      expect(onSelect).toHaveBeenCalledWith({
        startDate: '2026-01-01T00:00:00Z',
        endDate: '2026-01-31T00:00:00Z',
        fileSemester: null,
      })
    );

    expect(screen.getByTestId(DateRangeSelectorTestId)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {name: 'Pick Start'}));
    await userEvent.click(screen.getByRole('button', {name: 'Pick End'}));

    await waitFor(() =>
      expect(onSelect).toHaveBeenLastCalledWith({
        startDate: '2026-02-03T00:00:00Z',
        endDate: '2026-02-10T00:00:00Z',
        fileSemester: null,
      })
    );
    expect(ComponentTestHelper.get(DateRangeSelectorKey).length).toBeGreaterThan(0);
  });

  test('switches to semester mode and emits the selected semester dates', async () => {
    const onSelect = jest.fn();
    render(
      <DateRangeWithFileSemesterSelector
        defaultStartDate="2026-01-01T00:00:00Z"
        defaultEndDate="2026-01-31T00:00:00Z"
        onSelect={onSelect}
      />
    );

    await userEvent.click(screen.getByLabelText('Semesters'));
    expect(screen.getByTestId(SynFileSemesterSelectorTestId)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', {name: 'Pick Semester'}));

    await waitFor(() =>
      expect(onSelect).toHaveBeenLastCalledWith({
        startDate: '2026-03-01T00:00:00Z',
        endDate: '2026-03-31T00:00:00Z',
        fileSemester: SynFileSemesterSelectorOption.data,
      })
    );
    expect(ComponentTestHelper.get(SynFileSemesterSelectorKey).length).toBeGreaterThan(0);
  });
});
