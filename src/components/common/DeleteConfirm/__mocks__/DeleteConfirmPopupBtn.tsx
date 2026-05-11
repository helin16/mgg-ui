import React from 'react';
import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('DeleteConfirmPopupBtn');

export const DeleteConfirmPopupBtnKey = key;
export const DeleteConfirmPopupBtnTestId = testId;

const DeleteConfirmPopupBtn = (props: any) => {
  ComponentTestHelper.mockComponent(
    DeleteConfirmPopupBtnKey,
    DeleteConfirmPopupBtnTestId
  )(props);

  return <div data-testid={DeleteConfirmPopupBtnTestId}>{props.children}</div>;
};

export default DeleteConfirmPopupBtn;
