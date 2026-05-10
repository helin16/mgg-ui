import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId(
  'CampusDisplaySlideShowByLocationId'
);

export const CampusDisplaySlideShowByLocationIdKey = key;
export const CampusDisplaySlideShowByLocationIdTestId = testId;

const CampusDisplaySlideShowByLocationId = ComponentTestHelper.mockComponent(
  CampusDisplaySlideShowByLocationIdKey,
  CampusDisplaySlideShowByLocationIdTestId
);

export default CampusDisplaySlideShowByLocationId;
