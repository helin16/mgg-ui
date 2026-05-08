import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('CampusDisplayLocationEditPopupBtn');

export const CampusDisplayLocationEditPopupBtnKey = key;
export const CampusDisplayLocationEditPopupBtnTestId = testId;

const CampusDisplayLocationEditPopupBtn = ComponentTestHelper.mockComponent(
  CampusDisplayLocationEditPopupBtnKey,
  CampusDisplayLocationEditPopupBtnTestId
);

export default CampusDisplayLocationEditPopupBtn;
