import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('PageLoadingSpinner');

export const PageLoadingSpinnerKey = key;
export const PageLoadingSpinnerTestId = testId;

const PageLoadingSpinner = ComponentTestHelper.mockComponent(
  PageLoadingSpinnerKey,
  PageLoadingSpinnerTestId
);

export default PageLoadingSpinner;
