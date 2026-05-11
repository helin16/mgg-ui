import React from 'react';
import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('BTItemCategorySelector');

export const BTItemCategorySelectorKey = key;
export const BTItemCategorySelectorTestId = testId;
export const BTItemCategorySelectorOption = {
  data: {
    guid: 'category-guid-1',
    destination_gl_code: '2000',
  },
};

const BTItemCategorySelector = (props: any) => {
  ComponentTestHelper.mockComponent(BTItemCategorySelectorKey, BTItemCategorySelectorTestId)(props);

  return (
    <div data-testid={BTItemCategorySelectorTestId}>
      <button type="button" onClick={() => props?.onSelect?.(BTItemCategorySelectorOption)}>
        Select Category
      </button>
    </div>
  );
};

export default BTItemCategorySelector;
