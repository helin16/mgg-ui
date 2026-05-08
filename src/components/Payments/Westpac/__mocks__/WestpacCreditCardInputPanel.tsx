import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('WestpacCreditCardInputPanel');

export const WestpacCreditCardInputPanelKey = key;
export const WestpacCreditCardInputPanelTestId = testId;

const WestpacCreditCardInputPanel = ComponentTestHelper.mockComponent(
  WestpacCreditCardInputPanelKey,
  WestpacCreditCardInputPanelTestId
);

export default WestpacCreditCardInputPanel;
