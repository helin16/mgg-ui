import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('CampusDisplayList');

export const CampusDisplayListKey = key;
export const CampusDisplayListTestId = testId;

const CampusDisplayList = ComponentTestHelper.mockComponent(
  CampusDisplayListKey,
  CampusDisplayListTestId
);

export default CampusDisplayList;
