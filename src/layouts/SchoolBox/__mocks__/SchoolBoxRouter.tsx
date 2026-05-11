import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('SchoolBoxRouter');

export const SchoolBoxRouterKey = key;
export const SchoolBoxRouterTestId = testId;

const SchoolBoxRouter = ComponentTestHelper.mockComponent(
  SchoolBoxRouterKey,
  SchoolBoxRouterTestId
);

export default SchoolBoxRouter;
