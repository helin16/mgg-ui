import React from 'react';
import {render, screen} from '@testing-library/react';
import DateRangeSelector from '../../../components/common/DateRangeSelector';
import ComponentTestHelper from '../../helper/ComponentTestHelper';
import {DateTimePickerKey, DateTimePickerTestId} from '../../../components/common/__mocks__/DateTimePicker';

jest.mock('../../../components/form/FormLabel');
jest.mock('../../../components/common/DateTimePicker');

describe('DateRangeSelector', () => {
  ComponentTestHelper.prepare();

  test('renders the start and end date pickers with labels', () => {
    render(
      <DateRangeSelector
        startDate="2026-05-01"
        endDate="2026-05-02"
        onStartDateSelected={jest.fn()}
        onEndDateSelected={jest.fn()}
      />
    );

    expect(screen.getAllByTestId(DateTimePickerTestId)).toHaveLength(2);
    expect(ComponentTestHelper.get(DateTimePickerKey)[0]).toMatchObject({value: '2026-05-01'});
    expect(ComponentTestHelper.get(DateTimePickerKey)[1]).toMatchObject({value: '2026-05-02'});
  });
});
