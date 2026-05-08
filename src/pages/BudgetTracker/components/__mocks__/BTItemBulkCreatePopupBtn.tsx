import React from 'react';
import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId(
  'BTItemBulkCreatePopupBtn'
);

export const BTItemBulkCreatePopupBtnKey = key;
export const BTItemBulkCreatePopupBtnTestId = testId;

const BaseBTItemBulkCreatePopupBtn = ComponentTestHelper.mockComponent(
  BTItemBulkCreatePopupBtnKey,
  BTItemBulkCreatePopupBtnTestId
);

const BTItemBulkCreatePopupBtn = (props: any) => {
  BaseBTItemBulkCreatePopupBtn(props);

  return (
    <div data-testid={BTItemBulkCreatePopupBtnTestId}>{props.children}</div>
  );
};

export default BTItemBulkCreatePopupBtn;
