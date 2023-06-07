import React, {useState} from 'react';
import styled from 'styled-components';
import ModuleEmailTemplateNameEditor from '../../../components/module/ModuleEmailTemplateNameEditor';
import {MGGS_MODULE_ID_STUDENT_ABSENCES} from '../../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN} from '../../../types/modules/iRole';
import ModuleEditPanel from '../../../components/module/ModuleEditPanel';
import iModule from '../../../types/modules/iModule';
import SectionDiv from '../../studentReport/components/AcademicReports/DetailsComponents/sections/SectionDiv';
import {Form} from 'react-bootstrap';

const Wrapper = styled.div`
  
`;

type iEditPanel = {
  module: iModule;
  onUpdate: (data: any) => void;
}
const EditPanel = ({module, onUpdate}: iEditPanel) => {
  const [emailTemplateName, setEmailTemplateName] = useState(module.settings?.parentSubmissionForm?.templateName || '');
  const [emailRecipients, setEmailRecipients] = useState(`${module.settings?.parentSubmissionForm?.recipients || ''}`.trim());

  const handleUpdate = () => {
    onUpdate({
      ...(module?.settings || {}),
      parentSubmissionForm: {
        templateName: emailTemplateName,
        recipients: emailRecipients.split(',').map(email => `${email}`).filter(email => `${email}`.trim() !== '').join(','),
      }
    })
  }

  return (
    <Wrapper>
      <h5>Parent Submission</h5>
      <ModuleEmailTemplateNameEditor
        value={emailTemplateName}
        className={'content-row'}
        onChange={(event) => setEmailTemplateName(event.target.value)}
        handleUpdate={() => handleUpdate()}
      />
      <SectionDiv>
        <h5>Parent Submission Email Recipients</h5>
        <Form.Label>
          Recipients who will receive the notification after a submission by parent (email addresses separated by <b>,</b>):
        </Form.Label>
        <Form.Control
          placeholder="Email address separated by ,"
          value={ emailRecipients }
          onChange={(event) => {
            setEmailRecipients(event.target.value);
          }}
          onBlur={() => handleUpdate()}
        />
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
