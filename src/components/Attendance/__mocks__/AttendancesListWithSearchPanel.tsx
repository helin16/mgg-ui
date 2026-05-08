import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('AttendancesListWithSearchPanel');

export const AttendancesListWithSearchPanelKey = key;
export const AttendancesListWithSearchPanelTestId = testId;

const AttendancesListWithSearchPanel = ComponentTestHelper.mockComponent(
  AttendancesListWithSearchPanelKey,
  AttendancesListWithSearchPanelTestId
);

export default AttendancesListWithSearchPanel;
