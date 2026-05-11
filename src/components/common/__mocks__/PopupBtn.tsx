import React from 'react';
import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('PopupBtn');

export const PopupBtnKey = key;
export const PopupBtnTestId = testId;

const PopupBtn = (props: any) => {
  ComponentTestHelper.mockComponent(PopupBtnKey, PopupBtnTestId)(props);

  return (
    <div data-testid={PopupBtnTestId}>
      <div>{props?.children}</div>
      <div>{props?.popupProps?.children}</div>
    </div>
  );
};

export default PopupBtn;
