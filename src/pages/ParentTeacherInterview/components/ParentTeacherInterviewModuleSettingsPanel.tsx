import React, {useState} from 'react';
import {Form} from 'react-bootstrap';
import ModuleEditPanel from '../../../components/module/ModuleEditPanel';
import SectionDiv from '../../../components/common/SectionDiv';
import {FlexContainer} from '../../../styles';
import iModule from '../../../types/modules/iModule';
import {MGGS_MODULE_ID_PARENT_TEACHER_INTERVIEW} from '../../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN} from '../../../types/modules/iRole';

type iEditPanel = {
  module: iModule;
  onUpdate: (data: any) => void;
};

const EditPanel = ({module, onUpdate}: iEditPanel) => {
  const [subject, setSubject] = useState(`${module.settings?.parentTeacherInterviewCalendar?.subject || ''}`.trim());
  const [bodyText, setBodyText] = useState(`${module.settings?.parentTeacherInterviewCalendar?.bodyText || ''}`.trim());
  const [startDateTime, setStartDateTime] = useState(`${module.settings?.parentTeacherInterviewCalendar?.startDateTime || ''}`.trim());
  const [endDateTime, setEndDateTime] = useState(`${module.settings?.parentTeacherInterviewCalendar?.endDateTime || ''}`.trim());

  const handleUpdate = (
    nextSubject = subject,
    nextBodyText = bodyText,
    nextStartDateTime = startDateTime,
    nextEndDateTime = endDateTime
  ) => {
    onUpdate({
      ...(module?.settings || {}),
      parentTeacherInterviewCalendar: {
        ...(module?.settings?.parentTeacherInterviewCalendar || {}),
        subject: `${nextSubject || ''}`.trim(),
        bodyText: `${nextBodyText || ''}`.trim(),
        startDateTime: `${nextStartDateTime || ''}`.trim(),
        endDateTime: `${nextEndDateTime || ''}`.trim(),
      },
    });
  };

  return (
    <SectionDiv>
      <SectionDiv className={'margin-bottom'}>
        <h5>Parent Teacher Interview</h5>
        <FlexContainer className={'with-gap lg-gap wrap align-items-end'}>
          <div className={'full-width'} style={{flex: '1 1 260px'}}>
            <Form.Label>Subject</Form.Label>
            <Form.Control
              aria-label={'Subject'}
              value={subject}
              onChange={event => {
                const nextValue = event.target.value;
                setSubject(nextValue);
                handleUpdate(nextValue, bodyText, startDateTime, endDateTime);
              }}
            />
          </div>
          <div className={'full-width'} style={{flex: '1 1 260px'}}>
            <Form.Label>Default Interview Start Time</Form.Label>
            <Form.Control
              aria-label={'Default Interview Start Time'}
              type={'datetime-local'}
              value={startDateTime}
              onChange={event => {
                const nextValue = event.target.value;
                setStartDateTime(nextValue);
                handleUpdate(subject, bodyText, nextValue, endDateTime);
              }}
            />
          </div>
          <div className={'full-width'} style={{flex: '1 1 260px'}}>
            <Form.Label>Default Interview End Time</Form.Label>
            <Form.Control
              aria-label={'Default Interview End Time'}
              type={'datetime-local'}
              value={endDateTime}
              onChange={event => {
                const nextValue = event.target.value;
                setEndDateTime(nextValue);
                handleUpdate(subject, bodyText, startDateTime, nextValue);
              }}
            />
          </div>
        </FlexContainer>
      </SectionDiv>
      <SectionDiv>
        <Form.Label>Body Text</Form.Label>
        <Form.Control
          aria-label={'Body Text'}
          as={'textarea'}
          rows={8}
          value={bodyText}
          onChange={event => {
            const nextValue = event.target.value;
            setBodyText(nextValue);
            handleUpdate(subject, nextValue, startDateTime, endDateTime);
          }}
        />
      </SectionDiv>
    </SectionDiv>
  );
};

const ParentTeacherInterviewModuleSettingsPanel = () => {
  const [settings, setSettings] = useState({});

  return (
    <ModuleEditPanel
      moduleId={MGGS_MODULE_ID_PARENT_TEACHER_INTERVIEW}
      roleId={ROLE_ID_ADMIN}
      getChildren={(module: iModule) => (
        <EditPanel
          module={module}
          onUpdate={setSettings}
        />
      )}
      getSubmitData={() => settings}
    />
  );
};

export default ParentTeacherInterviewModuleSettingsPanel;
