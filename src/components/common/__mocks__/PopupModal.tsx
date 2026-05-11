import React from 'react';
import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('PopupModal');

export const PopupModalKey = key;
export const PopupModalTestId = testId;

const PopupModal = (props: any) => {
  ComponentTestHelper.mockComponent(PopupModalKey, PopupModalTestId)(props);

  if (!props?.show) {
    return null;
  }

  return (
    <div data-testid={PopupModalTestId}>
      <div>{props.title}</div>
      <div>{props.children}</div>
      <div>{props.footer}</div>
    </div>
  );
};

export default PopupModal;
