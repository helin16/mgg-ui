import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('OnlineDonationModuleSettingsPanel');

export const OnlineDonationModuleSettingsPanelKey = key;
export const OnlineDonationModuleSettingsPanelTestId = testId;

const OnlineDonationModuleSettingsPanel = ComponentTestHelper.mockComponent(
  OnlineDonationModuleSettingsPanelKey,
  OnlineDonationModuleSettingsPanelTestId
);

export default OnlineDonationModuleSettingsPanel;
