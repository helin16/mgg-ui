import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('StaffListPanel');

export const StaffListPanelKey = key;
export const StaffListPanelTestId = testId;

const StaffListPanel = ComponentTestHelper.mockComponent(
  StaffListPanelKey,
  StaffListPanelTestId
);

export default StaffListPanel;
