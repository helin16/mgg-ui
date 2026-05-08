import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('StudentRetainingRate');

export const StudentRetainingRateKey = key;
export const StudentRetainingRateTestId = testId;

const StudentRetainingRate = ComponentTestHelper.mockComponent(
  StudentRetainingRateKey,
  StudentRetainingRateTestId
);

export default StudentRetainingRate;
