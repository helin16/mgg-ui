import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('SchoolBoxUrlCheckPopup');

export const SchoolBoxUrlCheckPopupKey = key;
export const SchoolBoxUrlCheckPopupTestId = testId;

const SchoolBoxUrlCheckPopup = ComponentTestHelper.mockComponent(
  SchoolBoxUrlCheckPopupKey,
  SchoolBoxUrlCheckPopupTestId
);

export default SchoolBoxUrlCheckPopup;
