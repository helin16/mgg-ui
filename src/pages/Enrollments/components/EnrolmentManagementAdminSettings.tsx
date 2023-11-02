import React, {useState} from 'react';
import iModule from '../../../types/modules/iModule';
import ModuleEditPanel from '../../../components/module/ModuleEditPanel';
import {MGGS_MODULE_ID_ENROLLMENTS} from '../../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN} from '../../../types/modules/iRole';
import SectionDiv from '../../../components/common/SectionDiv';
import ExplanationPanel from '../../../components/ExplanationPanel';
import ModuleEmailTemplateNameEditor from '../../../components/module/ModuleEmailTemplateNameEditor';
import {Form} from 'react-bootstrap';
import styled from 'styled-components';

const Wrapper = styled.div``;

type iEditPanel = {
  module: iModule;
  onUpdate: (data: any) => void;
}
const EditPanel = ({module, onUpdate}: iEditPanel) => {
  const [expiryCCTemplate, setExpiryCCTemplate] = useState(module.settings?.expiryCC?.templateName || '');
  const [expiryCCRecipients, setExpiryCCRecipients] = useState(module.settings?.expiryCC?.recipients || '');

  const handleUpdate = () => {
    onUpdate({
      ...(module?.settings || {}),
      expiryCC: {
        ...(module?.settings?.expiryCC || {}),
        templateName: expiryCCTemplate,
        recipients: expiryCCRecipients,
      },
    })
  }

  return (
    <Wrapper>
      <SectionDiv>
        <h5>Expiring Passport(s) and Visa(s) Notification Settings</h5>
        <ExplanationPanel text={'Email notifications will be sent to the nominated recipients below every Wednesday night'} />
        <ModuleEmailTemplateNameEditor
          value={expiryCCTemplate}
          className={'content-row'}
          onChange={(event) => setExpiryCCTemplate(event.target.value)}
          handleUpdate={() => handleUpdate()}
        />
        <SectionDiv>
          <h6>Email Recipients</h6>
          <Form.Label>
            Recipients who will receive the notification (email addresses separated by <b>,</b>):
          </Form.Label>
          <Form.Control
            placeholder="Email address separated by ,"
            value={ expiryCCRecipients }
            onChange={(event) => {
              setExpiryCCRecipients(event.target.value);
            }}
            onBlur={() => handleUpdate()}
          />
        </SectionDiv>
      </SectionDiv>
    </Wrapper>
  )
}
const EnrolmentManagementAdminSettings = () => {
  const [settings, setSettings] = useState({});

  const getContent = (module: iModule) => {
    return (
      <EditPanel
        module={module}
        onUpdate={(newSettings: any) => setSettings(newSettings)}
      />
    );
  }

  return (
    <ModuleEditPanel
      moduleId={MGGS_MODULE_ID_ENROLLMENTS}
      roleId={ROLE_ID_ADMIN}
      getChildren={getContent}
      getSubmitData={() => (settings)}
    />
  )
}

export default EnrolmentManagementAdminSettings;
