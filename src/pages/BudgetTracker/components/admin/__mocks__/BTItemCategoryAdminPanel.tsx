import ComponentTestHelper from '../../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('BTItemCategoryAdminPanel');

export const BTItemCategoryAdminPanelKey = key;
export const BTItemCategoryAdminPanelTestId = testId;

const BTItemCategoryAdminPanel = ComponentTestHelper.mockComponent(
  BTItemCategoryAdminPanelKey,
  BTItemCategoryAdminPanelTestId
);

export default BTItemCategoryAdminPanel;
