import ComponentTestHelper from '../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('Page');

export const PageKey = key;
export const PageTestId = testId;

const Page = ComponentTestHelper.mockComponent(
  PageKey,
  PageTestId
);

export default Page;
