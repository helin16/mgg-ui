import React from 'react';
import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('LoadingBtn');

export const LoadingBtnKey = key;
export const LoadingBtnTestId = testId;

const LoadingBtn = (props: any) => {
  ComponentTestHelper.mockComponent(LoadingBtnKey, LoadingBtnTestId)(props);

  return (
    <button
      data-testid={LoadingBtnTestId}
      type="button"
      disabled={!!props?.isLoading}
      onClick={() => props?.onClick?.()}
    >
      {props?.children}
    </button>
  );
};

export default LoadingBtn;
