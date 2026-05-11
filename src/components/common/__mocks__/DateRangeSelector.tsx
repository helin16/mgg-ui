import React from 'react';
import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('DateRangeSelector');

export const DateRangeSelectorKey = key;
export const DateRangeSelectorTestId = testId;

const DateRangeSelector = (props: any) => {
  ComponentTestHelper.mockComponent(DateRangeSelectorKey, DateRangeSelectorTestId)(props);

  return (
    <div data-testid={DateRangeSelectorTestId}>
      <button type="button" onClick={() => props?.onStartDateSelected?.('2026-02-03')}>
        Pick Start
      </button>
      <button type="button" onClick={() => props?.onEndDateSelected?.('2026-02-10')}>
        Pick End
      </button>
    </div>
  );
};

export default DateRangeSelector;
