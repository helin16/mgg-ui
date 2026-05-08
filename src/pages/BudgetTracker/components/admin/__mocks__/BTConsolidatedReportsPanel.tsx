import ComponentTestHelper from '../../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('BTConsolidatedReportsPanel');

export const BTConsolidatedReportsPanelKey = key;
export const BTConsolidatedReportsPanelTestId = testId;

const BTConsolidatedReportsPanel = ComponentTestHelper.mockComponent(
  BTConsolidatedReportsPanelKey,
  BTConsolidatedReportsPanelTestId
);

export default BTConsolidatedReportsPanel;
