import React from 'react';
import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('CheckBox');

export const CheckBoxKey = key;
export const CheckBoxTestId = testId;

const CheckBox = (props: any) => {
  ComponentTestHelper.mockComponent(CheckBoxKey, CheckBoxTestId)(props);

  return (
    <input
      data-testid={CheckBoxTestId}
      type="checkbox"
      checked={!!props?.checked}
      onChange={() => props?.onChange?.()}
    />
  );
};

export default CheckBox;
