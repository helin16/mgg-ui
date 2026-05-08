import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('OnlineDonation');

export const OnlineDonationKey = key;
export const OnlineDonationTestId = testId;

const OnlineDonation = ComponentTestHelper.mockComponent(
  OnlineDonationKey,
  OnlineDonationTestId
);

export default OnlineDonation;
