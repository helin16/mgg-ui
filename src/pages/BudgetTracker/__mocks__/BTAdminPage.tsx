import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('BTAdminPage');

export const BTAdminPageKey = key;
export const BTAdminPageTestId = testId;

const BTAdminPage = ComponentTestHelper.mockComponent(
  BTAdminPageKey,
  BTAdminPageTestId
);

export default BTAdminPage;
