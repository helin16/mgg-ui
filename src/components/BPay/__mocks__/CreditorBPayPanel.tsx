import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('CreditorBPayPanel');

export const CreditorBPayPanelKey = key;
export const CreditorBPayPanelTestId = testId;

const CreditorBPayPanel = ComponentTestHelper.mockComponent(
  CreditorBPayPanelKey,
  CreditorBPayPanelTestId
);

export default CreditorBPayPanel;
