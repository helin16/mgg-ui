import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('OnlineDonationListPanel');

export const OnlineDonationListPanelKey = key;
export const OnlineDonationListPanelTestId = testId;

const OnlineDonationListPanel = ComponentTestHelper.mockComponent(
  OnlineDonationListPanelKey,
  OnlineDonationListPanelTestId
);

export default OnlineDonationListPanel;
