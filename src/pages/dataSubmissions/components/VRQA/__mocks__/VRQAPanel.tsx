import ComponentTestHelper from '../../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('VRQAPanel');

export const VRQAPanelKey = key;
export const VRQAPanelTestId = testId;

const VRQAPanel = ComponentTestHelper.mockComponent(
  VRQAPanelKey,
  VRQAPanelTestId
);

export default VRQAPanel;
