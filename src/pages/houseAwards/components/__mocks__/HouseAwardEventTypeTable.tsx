import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('HouseAwardEventTypeTable');

export const HouseAwardEventTypeTableKey = key;
export const HouseAwardEventTypeTableTestId = testId;

const HouseAwardEventTypeTable = ComponentTestHelper.mockComponent(
  HouseAwardEventTypeTableKey,
  HouseAwardEventTypeTableTestId
);

export default HouseAwardEventTypeTable;
