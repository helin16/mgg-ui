import ComponentTestHelper from '../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('Page401');

export const Page401Key = key;
export const Page401TestId = testId;

const Page401 = ComponentTestHelper.mockComponent(
  Page401Key,
  Page401TestId
);

export default Page401;
