import React, {useState} from 'react';
import styled from 'styled-components';
import {MGGS_MODULE_ID_ALUMNI_REQUEST} from '../../../types/modules/iModuleUser';
import ModuleEditPanel from '../../../components/module/ModuleEditPanel';
import {ROLE_ID_ADMIN} from '../../../types/modules/iRole';
import iModule from '../../../types/modules/iModule';
import ModuleEmailTemplateNameEditor from '../../../components/module/ModuleEmailTemplateNameEditor';


type iAlumniModuleEditPanelContent = {
  module: iModule;
  onUpdate: (data: any) => void;
}

const Wrapper = styled.div`
  .input-type-chg-btn {
    border: 1px solid #ced4da;
    background-color: white;
    color: #ced4da;
    border-left: none;
    outline: none;
  }
  .content-row {
    margin-bottom: 0.6rem;
  }
`;
const AlumniModuleEditPanelContent = ({module, onUpdate}: iAlumniModuleEditPanelContent) => {
  const [emailTemplateName, setEmailTemplateName] = useState(module?.settings?.emailTemplateName?.notifyApprovers || '');

  const handleUpdate = () => {
    onUpdate({
      ...(module?.settings || {}),
      emailTemplateName: {
        ...(module?.settings?.emailTemplateName || {}),
        notifyApprovers: emailTemplateName,
      }
    })
  }

  return (
    <Wrapper>
      <ModuleEmailTemplateNameEditor
        value={emailTemplateName}
        className={'content-row'}
        onChange={(event) => setEmailTemplateName(event.target.value)}
        handleUpdate={() => handleUpdate()}
      />
    </Wrapper>
  )
}

const AlumniModuleEditPanel = () => {
  const [settings, setSettings] = useState({});


  const getContent = (module: iModule) => {
    return (
      <AlumniModuleEditPanelContent module={module} onUpdate={(newSettings: any) => setSettings(newSettings)}/>
    )
  }
  console.log('settings', settings);
  return (
    <ModuleEditPanel
      moduleId={MGGS_MODULE_ID_ALUMNI_REQUEST}
      roleId={ROLE_ID_ADMIN}
      getChildren={getContent}
      getSubmitData={() => (settings)}
    />
  )
}

export default AlumniModuleEditPanel;
