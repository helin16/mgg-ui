import React from 'react';
import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('BTItemCreatePopupBtn');

export const BTItemCreatePopupBtnKey = key;
export const BTItemCreatePopupBtnTestId = testId;

const BaseBTItemCreatePopupBtn = ComponentTestHelper.mockComponent(
  BTItemCreatePopupBtnKey,
  BTItemCreatePopupBtnTestId
);

const BTItemCreatePopupBtn = (props: any) => {
  BaseBTItemCreatePopupBtn(props);

  return (
    <div className={props.className} data-testid={BTItemCreatePopupBtnTestId}>
      {props.children}
    </div>
  );
};

export default BTItemCreatePopupBtn;
