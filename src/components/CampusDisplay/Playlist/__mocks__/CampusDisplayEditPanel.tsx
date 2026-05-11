import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('CampusDisplayEditPanel');

export const CampusDisplayEditPanelKey = key;
export const CampusDisplayEditPanelTestId = testId;

const CampusDisplayEditPanel = ComponentTestHelper.mockComponent(
  CampusDisplayEditPanelKey,
  CampusDisplayEditPanelTestId
);

export default CampusDisplayEditPanel;
