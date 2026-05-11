import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('CampusDisplaySlideEditPopupBtn');

export const CampusDisplaySlideEditPopupBtnKey = key;
export const CampusDisplaySlideEditPopupBtnTestId = testId;

const CampusDisplaySlideEditPopupBtn = ComponentTestHelper.mockComponent(
  CampusDisplaySlideEditPopupBtnKey,
  CampusDisplaySlideEditPopupBtnTestId
);

export default CampusDisplaySlideEditPopupBtn;
