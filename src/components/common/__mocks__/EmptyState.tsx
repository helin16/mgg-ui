import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('EmptyState');

export const EmptyStateKey = key;
export const EmptyStateTestId = testId;

const EmptyState = ComponentTestHelper.mockComponent(
  EmptyStateKey,
  EmptyStateTestId
);

export default EmptyState;
