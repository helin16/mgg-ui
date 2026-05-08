import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('HouseAwardEventTable');

export const HouseAwardEventTableKey = key;
export const HouseAwardEventTableTestId = testId;

const HouseAwardEventTable = ComponentTestHelper.mockComponent(
  HouseAwardEventTableKey,
  HouseAwardEventTableTestId
);

export default HouseAwardEventTable;
