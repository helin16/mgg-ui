import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('HouseAwardAdminPage');

export const HouseAwardAdminPageKey = key;
export const HouseAwardAdminPageTestId = testId;

const HouseAwardAdminPage = ComponentTestHelper.mockComponent(
  HouseAwardAdminPageKey,
  HouseAwardAdminPageTestId
);

export default HouseAwardAdminPage;
