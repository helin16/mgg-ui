import React from 'react';
import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('DateTimePicker');

export const DateTimePickerKey = key;
export const DateTimePickerTestId = testId;

const DateTimePicker = (props: any) => {
  ComponentTestHelper.mockComponent(DateTimePickerKey, DateTimePickerTestId)(props);

  return (
    <div data-testid={DateTimePickerTestId}>
      <button type="button" onClick={() => props?.onChange?.(new Date('2026-03-04T05:06:07.000Z'))}>
        Pick Date Time
      </button>
      <button type="button" onClick={() => props?.onChange?.(null)}>
        Clear Date Time
      </button>
    </div>
  );
};

export default DateTimePicker;
