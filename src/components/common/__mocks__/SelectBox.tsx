import React from 'react';
import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('SelectBox');

export const SelectBoxKey = key;
export const SelectBoxTestId = testId;

const SelectBox = (props: any) => {
  ComponentTestHelper.mockComponent(SelectBoxKey, SelectBoxTestId)(props);

  return (
    <div data-testid={SelectBoxTestId}>
      <button type="button" onClick={() => props?.onChange?.(props?.options?.[0] || null)}>
        Select First Option
      </button>
    </div>
  );
};

export default SelectBox;
