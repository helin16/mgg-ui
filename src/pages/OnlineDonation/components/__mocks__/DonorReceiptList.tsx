import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('DonorReceiptList');

export const DonorReceiptListKey = key;
export const DonorReceiptListTestId = testId;

const DonorReceiptList = ComponentTestHelper.mockComponent(
  DonorReceiptListKey,
  DonorReceiptListTestId
);

export default DonorReceiptList;
