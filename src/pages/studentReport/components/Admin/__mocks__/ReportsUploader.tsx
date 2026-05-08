import ComponentTestHelper from '../../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('ReportsUploader');

export const ReportsUploaderKey = key;
export const ReportsUploaderTestId = testId;

const ReportsUploader = ComponentTestHelper.mockComponent(
  ReportsUploaderKey,
  ReportsUploaderTestId
);

export default ReportsUploader;
