import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('HouseAwardEventTypes');

export const HouseAwardEventTypesKey = key;
export const HouseAwardEventTypesTestId = testId;

const HouseAwardEventTypes = ComponentTestHelper.mockComponent(
  HouseAwardEventTypesKey,
  HouseAwardEventTypesTestId
);

export default HouseAwardEventTypes;
