import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('OnlineDonationAdminPage');

export const OnlineDonationAdminPageKey = key;
export const OnlineDonationAdminPageTestId = testId;

const OnlineDonationAdminPage = ComponentTestHelper.mockComponent(
  OnlineDonationAdminPageKey,
  OnlineDonationAdminPageTestId
);

export default OnlineDonationAdminPage;
