import React from 'react';
import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('FlagSelector');

export const FlagSelectorKey = key;
export const FlagSelectorTestId = testId;

const FlagSelector = (props: any) => {
  ComponentTestHelper.mockComponent(FlagSelectorKey, FlagSelectorTestId)(props);

  return (
    <div data-testid={FlagSelectorTestId}>
      <button type="button" onClick={() => props?.onSelect?.({value: true})}>
        Pick True
      </button>
      <button type="button" onClick={() => props?.onSelect?.({value: false})}>
        Pick False
      </button>
      <button type="button" onClick={() => props?.onSelect?.({value: ''})}>
        Clear
      </button>
    </div>
  );
};

export default FlagSelector;
