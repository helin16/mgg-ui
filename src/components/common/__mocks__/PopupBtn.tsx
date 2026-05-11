import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('PopupBtn');

export const PopupBtnKey = key;
export const PopupBtnTestId = testId;

const PopupBtn = ComponentTestHelper.mockComponent(
  PopupBtnKey,
  PopupBtnTestId
);

export default PopupBtn;
