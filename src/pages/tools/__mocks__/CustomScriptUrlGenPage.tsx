import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('CustomScriptUrlGenPage');

export const CustomScriptUrlGenPageKey = key;
export const CustomScriptUrlGenPageTestId = testId;

const CustomScriptUrlGenPage = ComponentTestHelper.mockComponent(
  CustomScriptUrlGenPageKey,
  CustomScriptUrlGenPageTestId
);

export default CustomScriptUrlGenPage;
