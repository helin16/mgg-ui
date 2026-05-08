import ComponentTestHelper from '../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('PageNotFound');

export const PageNotFoundKey = key;
export const PageNotFoundTestId = testId;

const PageNotFound = ComponentTestHelper.mockComponent(
  PageNotFoundKey,
  PageNotFoundTestId
);

export default PageNotFound;
