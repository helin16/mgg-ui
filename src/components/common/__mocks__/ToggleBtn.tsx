import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('ToggleBtn');

export const ToggleBtnKey = key;
export const ToggleBtnTestId = testId;

const ToggleBtn = ComponentTestHelper.mockComponent(
  ToggleBtnKey,
  ToggleBtnTestId
);

export default ToggleBtn;
