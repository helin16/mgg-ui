import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('PlayListEditPanel');

export const PlayListEditPanelKey = key;
export const PlayListEditPanelTestId = testId;

const PlayListEditPanel = ComponentTestHelper.mockComponent(
  PlayListEditPanelKey,
  PlayListEditPanelTestId
);

export default PlayListEditPanel;
