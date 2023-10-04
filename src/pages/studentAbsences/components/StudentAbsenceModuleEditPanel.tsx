import React, {useState} from 'react';
import styled from 'styled-components';
import ModuleEmailTemplateNameEditor from '../../../components/module/ModuleEmailTemplateNameEditor';
import {MGGS_MODULE_ID_STUDENT_ABSENCES} from '../../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN} from '../../../types/modules/iRole';
import ModuleEditPanel from '../../../components/module/ModuleEditPanel';
import iModule from '../../../types/modules/iModule';
import SectionDiv from '../../../components/common/SectionDiv';
import {Form} from 'react-bootstrap';
import ExplanationPanel from '../../../components/ExplanationPanel';

const Wrapper = styled.div`
  
`;

type iEditPanel = {
  module: iModule;
  onUpdate: (data: any) => void;
}
const EditPanel = ({module, onUpdate}: iEditPanel) => {
  const [parentEmailTemplateName, setParentEmailTemplateName] = useState(module.settings?.parentSubmissionForm?.templateName || '');
  const [parentEmailRecipients, setParentEmailRecipients] = useState(`${module.settings?.parentSubmissionForm?.recipients || ''}`.trim());
  const [earlySignOutTemplateName, setEarlySignOutTemplateName] = useState(`${module.settings?.templateNames?.earlySignOutNotification || ''}`.trim());
  const [lateSignInTemplateName, setLateSignInTemplateName] = useState(`${module.settings?.templateNames?.lateSignInNotification || ''}`.trim());

  const handleUpdate = () => {
    onUpdate({
      ...(module?.settings || {}),
      templateNames: {
        ...(module?.settings.templateNames || {}),
        earlySignOutNotification: earlySignOutTemplateName,
        lateSignInNotification: lateSignInTemplateName,
      },
      parentSubmissionForm: {
        templateName: parentEmailTemplateName,
        recipients: parentEmailRecipients.split(',').map(email => `${email}`).filter(email => `${email}`.trim() !== '').join(','),
      }
    })
  }

  return (
    <Wrapper>
      <SectionDiv>
        <h5>Email Notifications</h5>
        <h6>Early Sign Out - <small className={'text-muted'}>Email Notification Template for Early Sign Outs, email will send to Module Users, HOYs, HomeRoom Teachers and Parents(SC1 and SC2 with LiveWithFlag = true)</small> </h6>
        <ModuleEmailTemplateNameEditor
          value={earlySignOutTemplateName}
          className={'content-row'}
          onChange={(event) => setEarlySignOutTemplateName(event.target.value)}
          handleUpdate={() => handleUpdate()}
        />
        <h6>Late Sign In - <small className={'text-muted'}>Email Notification Template for Late Sign In, email will send to Module Users, HOYs and HomeRoom Teachers</small> </h6>
        <ModuleEmailTemplateNameEditor
          value={lateSignInTemplateName}
          className={'content-row'}
          onChange={(event) => setLateSignInTemplateName(event.target.value)}
          handleUpdate={() => handleUpdate()}
        />
      </SectionDiv>

      <SectionDiv className={'lg'}>
        <h5>Parent Submission</h5>
        <ExplanationPanel text={'Settings for the Parent Submission Form'} />
        <ModuleEmailTemplateNameEditor
          value={parentEmailTemplateName}
          className={'content-row'}
          onChange={(event) => setParentEmailTemplateName(event.target.value)}
          handleUpdate={() => handleUpdate()}
        />
        <SectionDiv>
          <h6>Parent Submission Email Recipients</h6>
          <Form.Label>
            Recipients who will receive the notification after a submission by parent (email addresses separated by <b>,</b>):
          </Form.Label>
          <Form.Control
            placeholder="Email address separated by ,"
            value={ parentEmailRecipients }
            onChange={(event) => {
              setParentEmailRecipients(event.target.value);
            }}
            onBlur={() => handleUpdate()}
          />
        </SectionDiv>
      </SectionDiv>
    </Wrapper>
  )
}
const StudentAbsenceModuleEditPanel = () => {
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
        moduleId={MGGS_MODULE_ID_STUDENT_ABSENCES}
        roleId={ROLE_ID_ADMIN}
        getChildren={getContent}
        getSubmitData={() => (settings)}
      />
  )
}

export default StudentAbsenceModuleEditPanel;
