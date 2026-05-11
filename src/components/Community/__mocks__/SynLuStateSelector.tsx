import React from 'react';
import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('SynLuStateSelector');

export const SynLuStateSelectorKey = key;
export const SynLuStateSelectorTestId = testId;
export const SynLuStateSelectorOption = {
  value: 'VIC',
  data: {
    Code: 'VIC',
  },
};

const SynLuStateSelector = (props: any) => {
  ComponentTestHelper.mockComponent(
    SynLuStateSelectorKey,
    SynLuStateSelectorTestId
  )(props);

  return (
    <div data-testid={SynLuStateSelectorTestId}>
      <button type="button" onClick={() => props?.onSelect?.(SynLuStateSelectorOption)}>
        Select State
      </button>
    </div>
  );
};

export default SynLuStateSelector;
