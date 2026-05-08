import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('SynLuHouseTable');

export const SynLuHouseTableKey = key;
export const SynLuHouseTableTestId = testId;

const SynLuHouseTable = ComponentTestHelper.mockComponent(
  SynLuHouseTableKey,
  SynLuHouseTableTestId
);

export default SynLuHouseTable;
