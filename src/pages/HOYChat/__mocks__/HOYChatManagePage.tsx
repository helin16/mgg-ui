import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('HOYChatManagePage');

export const HOYChatManagePageKey = key;
export const HOYChatManagePageTestId = testId;

const HOYChatManagePage = ComponentTestHelper.mockComponent(
  HOYChatManagePageKey,
  HOYChatManagePageTestId
);

export default HOYChatManagePage;
