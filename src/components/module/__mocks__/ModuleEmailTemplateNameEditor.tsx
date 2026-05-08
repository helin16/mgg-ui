import React from 'react';
import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId(
  'ModuleEmailTemplateNameEditor'
);

export const ModuleEmailTemplateNameEditorKey = key;
export const ModuleEmailTemplateNameEditorTestId = testId;

const BaseModuleEmailTemplateNameEditor = ComponentTestHelper.mockComponent(
  ModuleEmailTemplateNameEditorKey,
  ModuleEmailTemplateNameEditorTestId
);

const ModuleEmailTemplateNameEditor = (props: any) => {
  BaseModuleEmailTemplateNameEditor(props);

  return (
    <div data-testid={ModuleEmailTemplateNameEditorTestId}>
      Editor:{props.value}
    </div>
  );
};

export default ModuleEmailTemplateNameEditor;
