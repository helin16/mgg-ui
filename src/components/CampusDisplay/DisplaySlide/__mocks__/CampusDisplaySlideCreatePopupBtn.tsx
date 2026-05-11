import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('CampusDisplaySlideCreatePopupBtn');

export const CampusDisplaySlideCreatePopupBtnKey = key;
export const CampusDisplaySlideCreatePopupBtnTestId = testId;

const CampusDisplaySlideCreatePopupBtn = ComponentTestHelper.mockComponent(
  CampusDisplaySlideCreatePopupBtnKey,
  CampusDisplaySlideCreatePopupBtnTestId
);

export default CampusDisplaySlideCreatePopupBtn;
