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

const isValidLocalDateTime = (value: string) => `${value || ''}`.trim() !== '' && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(`${value}`.trim());
const isValidLocalDate = (value: string) => `${value || ''}`.trim() !== '' && /^\d{4}-\d{2}-\d{2}$/.test(`${value}`.trim());

const toDateValue = (value: string) => {
  const normalizedValue = `${value || ''}`.trim();
  if (isValidLocalDateTime(normalizedValue)) {
    return normalizedValue.split('T')[0];
  }
  if (isValidLocalDate(normalizedValue)) {
    return normalizedValue;
  }
  return '';
};

const normalizeKeywordList = (value: string) => {
  return Array.from(new Set(
    `${value || ''}`
      .split(/\r?\n|,/)
      .map(keyword => keyword.trim())
      .filter(keyword => keyword !== '')
  ));
};

const EditPanel = ({module, onUpdate}: iEditPanel) => {
  const [subject, setSubject] = useState(`${module.settings?.parentTeacherInterviewCalendar?.subject || ''}`.trim());
  const [bodyText, setBodyText] = useState(`${module.settings?.parentTeacherInterviewCalendar?.bodyText || ''}`.trim());
  const [isAllDay, setIsAllDay] = useState(module.settings?.parentTeacherInterviewCalendar?.isAllDay === true);
  const [allowUserChange, setAllowUserChange] = useState(module.settings?.parentTeacherInterviewCalendar?.allowUserChange !== false);
  const [startDateTime, setStartDateTime] = useState(`${module.settings?.parentTeacherInterviewCalendar?.startDateTime || ''}`.trim());
  const [endDateTime, setEndDateTime] = useState(`${module.settings?.parentTeacherInterviewCalendar?.endDateTime || ''}`.trim());
  const [excludedClassDescriptionKeywordsText, setExcludedClassDescriptionKeywordsText] = useState(
    (module.settings?.parentTeacherInterviewCalendar?.excludedClassDescriptionKeywords || []).join('\n')
  );

  const handleUpdate = (
    nextSubject = subject,
    nextBodyText = bodyText,
    nextIsAllDay = isAllDay,
    nextAllowUserChange = allowUserChange,
    nextStartDateTime = startDateTime,
    nextEndDateTime = endDateTime,
    nextExcludedClassDescriptionKeywordsText = excludedClassDescriptionKeywordsText
  ) => {
    onUpdate({
      ...(module?.settings || {}),
      parentTeacherInterviewCalendar: {
        ...(module?.settings?.parentTeacherInterviewCalendar || {}),
        subject: `${nextSubject || ''}`.trim(),
        bodyText: `${nextBodyText || ''}`.trim(),
        isAllDay: nextIsAllDay === true,
        allowUserChange: nextAllowUserChange !== false,
        startDateTime: `${nextStartDateTime || ''}`.trim(),
        endDateTime: `${nextEndDateTime || ''}`.trim(),
        excludedClassDescriptionKeywords: normalizeKeywordList(nextExcludedClassDescriptionKeywordsText),
      },
    });
  };

  return (
    <SectionDiv>
      <SectionDiv className={'margin-bottom'}>
        <h5>Parent Teacher Interview</h5>
        <div className={'row g-3 align-items-end'}>
          <div className={'col-lg-6'}>
            <Form.Label>Subject</Form.Label>
            <Form.Control
              aria-label={'Subject'}
              value={subject}
              onChange={event => {
                const nextValue = event.target.value;
                setSubject(nextValue);
                handleUpdate(nextValue, bodyText, isAllDay, allowUserChange, startDateTime, endDateTime);
              }}
            />
          </div>
          <div className={'col-lg-6'}>
            <Form.Label>Default Interview Time</Form.Label>
            <FlexContainer className={'with-gap align-items center'}>
              <Form.Check
                id={'default-all-day'}
                type={'checkbox'}
                label={'All Day'}
                checked={isAllDay}
                style={{width: '80px'}}
                onChange={event => {
                  const nextIsAllDay = event.target.checked;
                  const nextStartDateTime = nextIsAllDay ? toDateValue(startDateTime) : '';
                  const nextEndDateTime = nextIsAllDay ? toDateValue(endDateTime) : '';
                  setIsAllDay(nextIsAllDay);
                  setStartDateTime(nextStartDateTime);
                  setEndDateTime(nextEndDateTime);
                  handleUpdate(subject, bodyText, nextIsAllDay, allowUserChange, nextStartDateTime, nextEndDateTime);
                }}
              />
              <Form.Control
                aria-label={'Default Interview Start Time'}
                type={isAllDay ? 'date' : 'datetime-local'}
                value={startDateTime}
                style={{width: '200px'}}
                onChange={event => {
                  const nextValue = event.target.value;
                  setStartDateTime(nextValue);
                  handleUpdate(subject, bodyText, isAllDay, allowUserChange, nextValue, endDateTime);
                }}
              />
              <span>-</span>
              <Form.Control
                aria-label={'Default Interview End Time'}
                type={isAllDay ? 'date' : 'datetime-local'}
                value={endDateTime}
                style={{width: '200px'}}
                onChange={event => {
                  const nextValue = event.target.value;
                  setEndDateTime(nextValue);
                  handleUpdate(subject, bodyText, isAllDay, allowUserChange, startDateTime, nextValue);
                }}
              />
              <Form.Check
                id={'default-allow-user-change'}
                type={'checkbox'}
                label={'Allow user change'}
                checked={allowUserChange}
                style={{marginLeft: '32px'}}
                onChange={event => {
                  const nextValue = event.target.checked;
                  setAllowUserChange(nextValue);
                  handleUpdate(subject, bodyText, isAllDay, nextValue, startDateTime, endDateTime);
                }}
              />
            </FlexContainer>
          </div>
        </div>
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
            handleUpdate(subject, nextValue, isAllDay, allowUserChange, startDateTime, endDateTime);
          }}
        />
      </SectionDiv>
      <SectionDiv>
        <div className={'row g-3'}>
          <div className={'col-lg-6'}>
            <Form.Label>Excluded Class Description Keywords</Form.Label>
            <Form.Control
              aria-label={'Excluded Class Description Keywords'}
              as={'textarea'}
              rows={4}
              placeholder={'One keyword per line or comma-separated'}
              value={excludedClassDescriptionKeywordsText}
              onChange={event => {
                const nextValue = event.target.value;
                setExcludedClassDescriptionKeywordsText(nextValue);
                handleUpdate(subject, bodyText, isAllDay, allowUserChange, startDateTime, endDateTime, nextValue);
              }}
            />
          </div>
        </div>
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
