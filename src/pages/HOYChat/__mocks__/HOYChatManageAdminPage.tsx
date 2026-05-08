import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('HOYChatManageAdminPage');

export const HOYChatManageAdminPageKey = key;
export const HOYChatManageAdminPageTestId = testId;

const HOYChatManageAdminPage = ComponentTestHelper.mockComponent(
  HOYChatManageAdminPageKey,
  HOYChatManageAdminPageTestId
);

export default HOYChatManageAdminPage;
