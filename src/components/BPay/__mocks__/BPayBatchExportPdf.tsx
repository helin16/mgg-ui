import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('BPayBatchExportPdf');

export const BPayBatchExportPdfKey = key;
export const BPayBatchExportPdfTestId = testId;

const BPayBatchExportPdf = ComponentTestHelper.mockComponent(
  BPayBatchExportPdfKey,
  BPayBatchExportPdfTestId
);

export default BPayBatchExportPdf;
