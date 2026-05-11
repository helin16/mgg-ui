import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('ContactSupportPopupBtn');

export const ContactSupportPopupBtnKey = key;
export const ContactSupportPopupBtnTestId = testId;

const ContactSupportPopupBtn = ComponentTestHelper.mockComponent(
  ContactSupportPopupBtnKey,
  ContactSupportPopupBtnTestId
);

export default ContactSupportPopupBtn;
