import ComponentTestHelper from '../../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('GenComparativePopupBtn');

export const GenComparativePopupBtnKey = key;
export const GenComparativePopupBtnTestId = testId;

const GenComparativePopupBtn = ComponentTestHelper.mockComponent(
  GenComparativePopupBtnKey,
  GenComparativePopupBtnTestId
);

export default GenComparativePopupBtn;
