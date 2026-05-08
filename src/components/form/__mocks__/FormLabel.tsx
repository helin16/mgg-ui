import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('FormLabel');

export const FormLabelKey = key;
export const FormLabelTestId = testId;

const FormLabel = ComponentTestHelper.mockComponent(
  FormLabelKey,
  FormLabelTestId
);

export default FormLabel;
