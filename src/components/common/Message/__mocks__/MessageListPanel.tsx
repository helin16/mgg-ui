import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('MessageListPanel');

export const MessageListPanelKey = key;
export const MessageListPanelTestId = testId;

const MessageListPanel = ComponentTestHelper.mockComponent(
  MessageListPanelKey,
  MessageListPanelTestId
);

export default MessageListPanel;
