import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('SchoolBoxDebugInfo');

export const SchoolBoxDebugInfoKey = key;
export const SchoolBoxDebugInfoTestId = testId;

const SchoolBoxDebugInfo = ComponentTestHelper.mockComponent(
  SchoolBoxDebugInfoKey,
  SchoolBoxDebugInfoTestId
);

export default SchoolBoxDebugInfo;
