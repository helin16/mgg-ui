import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('FormErrorDisplay');

export const FormErrorDisplayKey = key;
export const FormErrorDisplayTestId = testId;

const FormErrorDisplay = ComponentTestHelper.mockComponent(
  FormErrorDisplayKey,
  FormErrorDisplayTestId
);

export default FormErrorDisplay;
