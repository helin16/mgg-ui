import React from 'react';
import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('EmailTemplateBuilder');

export const EmailTemplateBuilderKey = key;
export const EmailTemplateBuilderTestId = testId;

const fakeEditor = {
  exportHtml: (callback: (data: {design: any; html: string}) => void) => {
    callback({design: {fake: 'design'}, html: '<p>fake html</p>'});
  },
};

const EmailTemplateBuilder = (props: any) => {
  ComponentTestHelper.mockComponent(EmailTemplateBuilderKey, EmailTemplateBuilderTestId)(props);

  return (
    <div data-testid={EmailTemplateBuilderTestId}>
      <button type="button" onClick={() => props?.onUpdated?.(fakeEditor, {})}>
        Trigger Design Update
      </button>
    </div>
  );
};

export default EmailTemplateBuilder;
