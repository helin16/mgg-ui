import ComponentTestHelper from '../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('RedPage');

export const RedPageKey = key;
export const RedPageTestId = testId;

const RedPage = ComponentTestHelper.mockComponent(
  RedPageKey,
  RedPageTestId
);

export default RedPage;
