import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('BPayBatchResultPanel');

export const BPayBatchResultPanelKey = key;
export const BPayBatchResultPanelTestId = testId;

const BPayBatchResultPanel = ComponentTestHelper.mockComponent(
  BPayBatchResultPanelKey,
  BPayBatchResultPanelTestId
);

export default BPayBatchResultPanel;
