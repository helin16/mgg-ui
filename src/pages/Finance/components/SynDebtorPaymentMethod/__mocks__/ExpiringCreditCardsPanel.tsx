import ComponentTestHelper from '../../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('ExpiringCreditCardsPanel');

export const ExpiringCreditCardsPanelKey = key;
export const ExpiringCreditCardsPanelTestId = testId;

const ExpiringCreditCardsPanel = ComponentTestHelper.mockComponent(
  ExpiringCreditCardsPanelKey,
  ExpiringCreditCardsPanelTestId
);

export default ExpiringCreditCardsPanel;
