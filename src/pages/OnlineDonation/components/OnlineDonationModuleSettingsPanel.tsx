import React, {useState} from 'react';
import iModule from '../../../types/modules/iModule';
import ModuleEditPanel from '../../../components/module/ModuleEditPanel';
import {MGGS_MODULE_ID_ONLINE_DONATION} from '../../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN} from '../../../types/modules/iRole';
import SectionDiv from '../../../components/common/SectionDiv';
import ModuleEmailTemplateNameEditor from '../../../components/module/ModuleEmailTemplateNameEditor';
import {Form} from 'react-bootstrap';
import styled from 'styled-components';
import RichTextEditor from '../../../components/common/RichTextEditor/RichTextEditor';

const Wrapper = styled.div``;
type iEditPanel = {
  module: iModule;
  onUpdate: (data: any) => void;
}
const EditPanel = ({module, onUpdate}: iEditPanel) => {
  const [notificationEmailTemplateName, setNotificationEmailTemplateName] = useState(module.settings?.notification?.templateName || '');
  const [notificationRecipients, setNotificationRecipients] = useState(module.settings?.notification?.recipients || '');
  const [successMsg, setSuccessMsg] = useState(module.settings?.successMsg || '');

  const handleUpdate = () => {
    onUpdate({
      ...(module?.settings || {}),
      notification: {
        ...(module?.settings?.notification || {}),
        templateName: notificationEmailTemplateName,
        recipients: notificationRecipients,
      },
      successMsg,
    })
  }

  return (
    <Wrapper>
      <SectionDiv>
        <h5>Email Notifications - <small className={'text-muted'}>when a donation has been submitted</small></h5>
        <SectionDiv>
          <h6>Email template </h6>
          <ModuleEmailTemplateNameEditor
            value={notificationEmailTemplateName}
            className={'content-row'}
            onChange={(event) => setNotificationEmailTemplateName(event.target.value)}
            handleUpdate={() => handleUpdate()}
          />
        </SectionDiv>

        <SectionDiv>
          <h6>Email Recipients</h6>
          <Form.Label>
            Recipients who will receive the notification after a donation has been submitted (email addresses separated by <b>,</b>):
          </Form.Label>
          <Form.Control
            placeholder="Email address separated by ,"
            value={ notificationRecipients }
            onChange={(event) => {
              setNotificationRecipients(event.target.value);
            }}
            onBlur={() => handleUpdate()}
          />
        </SectionDiv>
      </SectionDiv>


      <SectionDiv className={'margin-bottom'}>
        <h5>Success Message - <small className={'text-muted'}>Displaying message when a donation has been submitted</small></h5>
        <RichTextEditor
          value={successMsg}
          onChange={(newText) => setSuccessMsg(newText)}
        />
      </SectionDiv>

    </Wrapper>
  )
}

const OnlineDonationModuleSettingsPanel = () => {
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
      moduleId={MGGS_MODULE_ID_ONLINE_DONATION}
      roleId={ROLE_ID_ADMIN}
      getChildren={getContent}
      getSubmitData={() => (settings)}
    />
  )
}

export default OnlineDonationModuleSettingsPanel
