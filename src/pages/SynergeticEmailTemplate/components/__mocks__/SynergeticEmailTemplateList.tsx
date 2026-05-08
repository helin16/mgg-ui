import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('SynergeticEmailTemplateList');

export const SynergeticEmailTemplateListKey = key;
export const SynergeticEmailTemplateListTestId = testId;

const SynergeticEmailTemplateList = ComponentTestHelper.mockComponent(
  SynergeticEmailTemplateListKey,
  SynergeticEmailTemplateListTestId
);

export default SynergeticEmailTemplateList;
