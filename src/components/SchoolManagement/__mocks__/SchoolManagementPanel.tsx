import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('SchoolManagementPanel');

export const SchoolManagementPanelKey = key;
export const SchoolManagementPanelTestId = testId;

const SchoolManagementPanel = ComponentTestHelper.mockComponent(
  SchoolManagementPanelKey,
  SchoolManagementPanelTestId
);

export default SchoolManagementPanel;
