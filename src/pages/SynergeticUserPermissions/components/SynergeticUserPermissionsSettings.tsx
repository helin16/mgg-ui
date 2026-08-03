import {useState} from 'react';
import {Form} from 'react-bootstrap';
import SectionDiv from '../../../components/common/SectionDiv';
import ModuleEditPanel from '../../../components/module/ModuleEditPanel';
import SynLuDocumentClassificationSelector
  from '../../../components/Synergetic/SynLuDocumentClassificationSelector';
import iModule from '../../../types/modules/iModule';
import {MGGS_MODULE_ID_SYNERGETIC_USER_PERMISSIONS} from '../../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN} from '../../../types/modules/iRole';
import {iAutoCompleteSingle} from '../../../components/common/AutoComplete';
import SynConfigUserSelector from '../../../components/Synergetic/SynConfigUserSelector';

type iSettingsEditor = {
  module: iModule;
  onUpdate: (settings: any) => void;
};

const SettingsEditor = ({module, onUpdate}: iSettingsEditor) => {
  const [documentClassificationCodes, setDocumentClassificationCodes] = useState<string[]>(
    module.settings?.documentClassificationCodes || []
  );
  const [excludedUserIds, setExcludedUserIds] = useState<number[]>(
    module.settings?.excludedUserIds || []
  );

  const updateClassifications = (selection: iAutoCompleteSingle | iAutoCompleteSingle[] | null) => {
    const selectedOptions = Array.isArray(selection) ? selection : selection ? [selection] : [];
    const codes = selectedOptions.map(option => `${option.value}`);
    setDocumentClassificationCodes(codes);
    onUpdate({
      ...(module.settings || {}),
      documentClassificationCodes: codes,
      excludedUserIds,
    });
  };

  const updateExcludedUsers = (selection: iAutoCompleteSingle | iAutoCompleteSingle[] | null) => {
    const selectedOptions = Array.isArray(selection) ? selection : selection ? [selection] : [];
    const userIds = selectedOptions.map(option => Number(option.value));
    setExcludedUserIds(userIds);
    onUpdate({
      ...(module.settings || {}),
      documentClassificationCodes,
      excludedUserIds: userIds,
    });
  };

  return (
    <SectionDiv>
      <h5>Document Classifications</h5>
      <Form.Label>
        Select the document classifications that users can display.
      </Form.Label>
      <SynLuDocumentClassificationSelector
        values={documentClassificationCodes}
        onSelect={updateClassifications}
        isMulti
        allowClear
      />
      <SectionDiv>
        <h5>Excluded Users</h5>
        <Form.Label>
          Select users who should not appear in the document classification permission tables.
        </Form.Label>
        <SynConfigUserSelector
          values={excludedUserIds}
          onSelect={updateExcludedUsers}
          isMulti
          allowClear
        />
      </SectionDiv>
    </SectionDiv>
  );
};

const SynergeticUserPermissionsSettings = () => {
  const [settings, setSettings] = useState<any>({});

  return (
    <ModuleEditPanel
      moduleId={MGGS_MODULE_ID_SYNERGETIC_USER_PERMISSIONS}
      roleId={ROLE_ID_ADMIN}
      getChildren={module => <SettingsEditor module={module} onUpdate={setSettings} />}
      getSubmitData={() => settings}
    />
  );
};

export {SettingsEditor};
export default SynergeticUserPermissionsSettings;
