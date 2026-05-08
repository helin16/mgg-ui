import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('SynergeticEmailTemplateManagerAdminPage');

export const SynergeticEmailTemplateManagerAdminPageKey = key;
export const SynergeticEmailTemplateManagerAdminPageTestId = testId;

const SynergeticEmailTemplateManagerAdminPage = ComponentTestHelper.mockComponent(
  SynergeticEmailTemplateManagerAdminPageKey,
  SynergeticEmailTemplateManagerAdminPageTestId
);

export default SynergeticEmailTemplateManagerAdminPage;
