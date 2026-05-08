import ComponentTestHelper from '../../../../../__tests__/helper/ComponentTestHelper';

const actual = jest.requireActual('../BTAdminOptionsPanel');
const {key, testId} = ComponentTestHelper.getKeyAndTestId('BTAdminOptionsPanel');

export const BTAdminOptionsPanelKey = key;
export const BTAdminOptionsPanelTestId = testId;

const BTAdminOptionsPanel = ComponentTestHelper.mockComponent(
  BTAdminOptionsPanelKey,
  BTAdminOptionsPanelTestId
);

module.exports = {
  ...actual,
  __esModule: true,
  default: BTAdminOptionsPanel,
  BTAdminOptionsPanelKey,
  BTAdminOptionsPanelTestId,
};
