import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('CampusDisplayLocationList');

export const CampusDisplayLocationListKey = key;
export const CampusDisplayLocationListTestId = testId;

const CampusDisplayLocationList = ComponentTestHelper.mockComponent(
  CampusDisplayLocationListKey,
  CampusDisplayLocationListTestId
);

export default CampusDisplayLocationList;
