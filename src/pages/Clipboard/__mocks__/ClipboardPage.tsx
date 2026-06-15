import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('ClipboardPage');

export const ClipboardPageKey = key;
export const ClipboardPageTestId = testId;

const ClipboardPage = ComponentTestHelper.mockComponent(
  ClipboardPageKey,
  ClipboardPageTestId
);

export default ClipboardPage;
