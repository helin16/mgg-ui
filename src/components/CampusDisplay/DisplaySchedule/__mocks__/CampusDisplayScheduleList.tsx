import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('CampusDisplayScheduleList');

export const CampusDisplayScheduleListKey = key;
export const CampusDisplayScheduleListTestId = testId;

const CampusDisplayScheduleList = ComponentTestHelper.mockComponent(
  CampusDisplayScheduleListKey,
  CampusDisplayScheduleListTestId
);

export default CampusDisplayScheduleList;
