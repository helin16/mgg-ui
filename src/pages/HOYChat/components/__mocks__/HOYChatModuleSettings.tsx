import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('HOYChatModuleSettings');

export const HOYChatModuleSettingsKey = key;
export const HOYChatModuleSettingsTestId = testId;

const HOYChatModuleSettings = ComponentTestHelper.mockComponent(
  HOYChatModuleSettingsKey,
  HOYChatModuleSettingsTestId
);

export default HOYChatModuleSettings;
