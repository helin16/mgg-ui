import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('UserAndDateTimePanel');

export const UserAndDateTimePanelKey = key;
export const UserAndDateTimePanelTestId = testId;

const UserAndDateTimePanel = ComponentTestHelper.mockComponent(
  UserAndDateTimePanelKey,
  UserAndDateTimePanelTestId
);

export default UserAndDateTimePanel;
