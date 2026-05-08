import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('LoadingBtn');

export const LoadingBtnKey = key;
export const LoadingBtnTestId = testId;

const LoadingBtn = ComponentTestHelper.mockComponent(
  LoadingBtnKey,
  LoadingBtnTestId
);

export default LoadingBtn;
