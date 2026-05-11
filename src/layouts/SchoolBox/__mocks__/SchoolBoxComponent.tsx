import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('SchoolBoxComponent');

export const SchoolBoxComponentKey = key;
export const SchoolBoxComponentTestId = testId;

const SchoolBoxComponent = ComponentTestHelper.mockComponent(
  SchoolBoxComponentKey,
  SchoolBoxComponentTestId
);

export default SchoolBoxComponent;
